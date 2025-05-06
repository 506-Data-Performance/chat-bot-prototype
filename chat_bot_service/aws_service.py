# aws_service.py
import os
import json
import time
import boto3
from datetime import datetime
from botocore.exceptions import ClientError
import uuid
import pathlib

class AWSService:
    def __init__(self, template_path=None):
        # Load AWS config from environment
        self.aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
        self.aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
        self.aws_region = os.getenv("AWS_REGION", "eu-central-1")
        self.s3_bucket = os.getenv("AWS_S3_BUCKET", "506-chatbot-code-bucket")
        self.cloudfront_distribution_id = os.getenv("CLOUDFRONT_DISTRIBUTION_ID", "E16WVT1SJTCH7F")
        
        # Set path to the bot template file
        if template_path:
            self.template_path = template_path
        else:
            # Default to a template in the same directory as this file
            current_dir = pathlib.Path(__file__).parent.absolute()
            self.template_path = os.path.join(current_dir, 'bot_template.js')
        
        # Initialize AWS clients
        self.s3 = boto3.client('s3',
                            aws_access_key_id=self.aws_access_key,
                            aws_secret_access_key=self.aws_secret_key,
                            region_name=self.aws_region)
        
        self.cf = boto3.client('cloudfront',
                            aws_access_key_id=self.aws_access_key,
                            aws_secret_access_key=self.aws_secret_key,
                            region_name=self.aws_region)
        
        self.sts = boto3.client('sts',
                            aws_access_key_id=self.aws_access_key,
                            aws_secret_access_key=self.aws_secret_key,
                            region_name=self.aws_region)
    
    # Fixed CloudFront OAI handling in publish_bot method
    def publish_bot(self, config):
        """
        Publish a new bot by combining the template with the provided configuration
        
        Parameters:
        - config (dict): The configuration to use for the new bot
        
        Returns:
        - dict: Response with status information
        - int: HTTP status code
        """
        try:
            print(f"publish_bot called with config: {json.dumps(config, indent=2)[:100]}...")  # Truncated for brevity
        
            # Validate the configuration structure
            required_fields = ['LOGO_URL', 'CHAT_TITLE', 'CHAT_SUBTITLE', 'PICKER_GREETING', 
                            'COLORS', 'ERROR_MESSAGE', 'INPUT_PLACEHOLDER', 'API_ENDPOINT', 'ASSISTANTS']
            
            for field in required_fields:
                if field not in config:
                    return {"error": f"Missing required field in config: {field}"}, 400
            
            # Check if template file exists
            if not os.path.exists(self.template_path):
                return {"error": f"Template file not found at {self.template_path}"}, 500
            
            # Read the template file
            with open(self.template_path, 'r', encoding='utf-8') as template_file:
                template_content = template_file.read()
            
            # Find the configuration placeholder in the template
            config_start = template_content.find('const myCustomConfig = ')
            if config_start == -1:
                return {"error": "Could not find configuration section in template file"}, 500
            
            config_end = template_content.find('// End of configuration', config_start)
            if config_end == -1:
                # Try alternative markers
                for marker in ['// Immediately-invoked function expression', '// IIFE', '// Main code begins']:
                    config_end = template_content.find(marker, config_start)
                    if config_end != -1:
                        break
                
                if config_end == -1:
                    # If no marker found, find the next semicolon and line break
                    semi_colon = template_content.find(';', config_start + 20)
                    if semi_colon != -1:
                        config_end = template_content.find('\n', semi_colon)
                        if config_end == -1:
                            config_end = semi_colon + 1
                    else:
                        return {"error": "Could not find end of configuration section in template file"}, 500
            
            # Pretty-print the JSON configuration object
            pretty_config = "const myCustomConfig = " + json.dumps(config, indent=2) + ";\n"
            
            # Create the updated content
            bot_content = template_content[:config_start] + pretty_config + template_content[config_end:]
            
            # Generate a unique key for this bot
            key = f"bot-{uuid.uuid4().hex}.js"
            
            # Upload the file to S3
            self.s3.put_object(
                Bucket=self.s3_bucket,
                Key=key,
                Body=bot_content,
                ContentType='application/javascript',
                CacheControl='public, max-age=31536000'
            )
            
            # Find or create a single Origin Access Identity with robust error handling
            try:
                # Check OAI list
                oai_list_response = self.cf.list_cloud_front_origin_access_identities(MaxItems="1")
                
                if 'CloudFrontOriginAccessIdentityList' in oai_list_response:
                    oai_list = oai_list_response['CloudFrontOriginAccessIdentityList']
                    items = oai_list.get('Items', [])
                    
                    if items and len(items) > 0:
                        # Check if we have the expected structure and access fields directly if available
                        if 'Id' in items[0] and 'S3CanonicalUserId' in items[0]:
                            oai_id = items[0]['Id']
                            oai_user = items[0]['S3CanonicalUserId']
                        elif 'CloudFrontOriginAccessIdentity' in items[0]:
                            # Original expected structure
                            oai = items[0]['CloudFrontOriginAccessIdentity']
                            oai_id = oai['Id']
                            oai_user = oai['S3CanonicalUserId']
                        else:
                            # Create a new OAI since structure was unexpected
                            caller_ref = str(int(time.time()))
                            cfg = {
                                'CallerReference': caller_ref,
                                'Comment': f'OAI for bucket {self.s3_bucket}'
                            }
                            create_response = self.cf.create_cloud_front_origin_access_identity(
                                CloudFrontOriginAccessIdentityConfig=cfg
                            )
                            
                            # Extract from response
                            if 'CloudFrontOriginAccessIdentity' in create_response:
                                oai = create_response['CloudFrontOriginAccessIdentity']
                                oai_id = oai['Id']
                                oai_user = oai['S3CanonicalUserId']
                            else:
                                # Fallback with default values if structure is unexpected
                                oai_id = create_response.get('Id', str(uuid.uuid4()))
                                oai_user = create_response.get('S3CanonicalUserId', 'unknown-user')
                    else:
                        # No items, create a new OAI
                        caller_ref = str(int(time.time()))
                        cfg = {
                            'CallerReference': caller_ref,
                            'Comment': f'OAI for bucket {self.s3_bucket}'
                        }
                        create_response = self.cf.create_cloud_front_origin_access_identity(
                            CloudFrontOriginAccessIdentityConfig=cfg
                        )
                        oai = create_response['CloudFrontOriginAccessIdentity']
                        oai_id = oai['Id']
                        oai_user = oai['S3CanonicalUserId']
                else:
                    # No CloudFrontOriginAccessIdentityList, create a new OAI
                    caller_ref = str(int(time.time()))
                    cfg = {
                        'CallerReference': caller_ref,
                        'Comment': f'OAI for bucket {self.s3_bucket}'
                    }
                    create_response = self.cf.create_cloud_front_origin_access_identity(
                        CloudFrontOriginAccessIdentityConfig=cfg
                    )
                    oai = create_response['CloudFrontOriginAccessIdentity']
                    oai_id = oai['Id']
                    oai_user = oai['S3CanonicalUserId']
                    
            except Exception as oai_error:
                # Try a simpler approach - create a new OAI directly
                try:
                    caller_ref = str(int(time.time()))
                    cfg = {
                        'CallerReference': caller_ref,
                        'Comment': f'OAI for bucket {self.s3_bucket}'
                    }
                    oai = self.cf.create_cloud_front_origin_access_identity(
                        CloudFrontOriginAccessIdentityConfig=cfg
                    )['CloudFrontOriginAccessIdentity']
                    oai_id = oai['Id']
                    oai_user = oai['S3CanonicalUserId']
                except Exception as retry_error:
                    # Return success for S3 upload but mention the CloudFront error
                    return {
                        "message": "Bot uploaded to S3 but CloudFront distribution creation failed",
                        "error_details": str(oai_error),
                        "key": key,
                        "s3_bucket": self.s3_bucket,
                        "s3_path": f"s3://{self.s3_bucket}/{key}"
                    }, 202
            
            origin_access_identity = f'origin-access-identity/cloudfront/{oai_id}'
            
            # Create the CloudFront distribution
            origin_id = f"S3-{self.s3_bucket}"
            dist_cfg = {
                'CallerReference': str(int(time.time())),
                'Comment': f"Distribution for {key}",
                'Enabled': True,
                'Origins': {
                    'Quantity': 1,
                    'Items': [{
                        'Id': origin_id,
                        'DomainName': f"{self.s3_bucket}.s3.amazonaws.com",
                        'OriginPath': '',
                        'S3OriginConfig': {
                            'OriginAccessIdentity': origin_access_identity
                        }
                    }]
                },
                'DefaultCacheBehavior': {
                    'TargetOriginId': origin_id,
                    'ViewerProtocolPolicy': 'redirect-to-https',
                    'AllowedMethods': {
                        'Quantity': 2,
                        'Items': ['GET', 'HEAD'],
                        'CachedMethods': {
                            'Quantity': 2,
                            'Items': ['GET', 'HEAD']
                        }
                    },
                    'ForwardedValues': {
                        'QueryString': False,
                        'Cookies': {'Forward': 'none'}
                    },
                    'MinTTL': 0,
                    'DefaultTTL': 86400,
                    'MaxTTL': 31536000
                },
                'PriceClass': 'PriceClass_All',
            }
            dist = self.cf.create_distribution(DistributionConfig=dist_cfg)['Distribution']
            dist_id = dist['Id']
            domain = dist['DomainName']
            
            # Update bucket policy to let that OAI read your objects
            try:
                try:
                    raw = self.s3.get_bucket_policy(Bucket=self.s3_bucket)['Policy']
                    policy = json.loads(raw)
                except ClientError as e:
                    if e.response['Error']['Code'] == 'NoSuchBucketPolicy':
                        policy = {"Version": "2012-10-17", "Statement": []}
                    else:
                        raise
                
                # Check if an OAI policy for this OAI already exists to avoid duplicates
                oai_policy_exists = False
                for statement in policy.get('Statement', []):
                    if statement.get('Sid') == f"AllowOAI_{oai_id}":
                        oai_policy_exists = True
                        break
                
                # Only add the policy if it doesn't exist
                if not oai_policy_exists:
                    policy['Statement'].append({
                        "Sid": f"AllowOAI_{oai_id}",
                        "Effect": "Allow",
                        "Principal": { "CanonicalUser": oai_user },
                        "Action": "s3:GetObject",
                        "Resource": f"arn:aws:s3:::{self.s3_bucket}/*"
                    })
                    self.s3.put_bucket_policy(Bucket=self.s3_bucket, Policy=json.dumps(policy))
            except Exception as policy_error:
                # Continue anyway, we still have a working distribution
                pass
            
            # Return the <script> tag
            script_tag = f'<script src="https://{domain}/{key}"></script>'
            return {
                "message": "Bot published from template—distribution is deploying in background",
                "distributionId": dist_id,
                "domainName": domain,
                "key": key,
                "scriptTag": script_tag
            }, 202
            
        except Exception as e:
            # Log the error but keep the message simple for the user
            print(f"Error in publish_bot: {str(e)}")
            return {"error": f"Operation failed: {str(e)}"}, 500
        
    def update_bot_config(self, new_config, key='bot.js'):
        """
        Update the bot configuration by using a local template file
        
        Parameters:
        - new_config (dict): The new configuration to apply to the bot
        - key (str): The S3 key to use when uploading the updated bot (defaults to 'bot.js')
        
        Returns:
        - dict: Response with status information
        - int: HTTP status code
        """
        # Validate the configuration structure
        required_fields = ['LOGO_URL', 'CHAT_TITLE', 'CHAT_SUBTITLE', 'PICKER_GREETING', 
                          'COLORS', 'ERROR_MESSAGE', 'INPUT_PLACEHOLDER', 'API_ENDPOINT', 'ASSISTANTS']
        
        for field in required_fields:
            if field not in new_config:
                return {"error": f"Missing required field in config: {field}"}, 400
        
        try:
            # Check if template file exists
            if not os.path.exists(self.template_path):
                return {"error": f"Template file not found at {self.template_path}"}, 500
            
            # Read the template file
            with open(self.template_path, 'r', encoding='utf-8') as template_file:
                template_content = template_file.read()
            
            # Find the configuration placeholder in the template
            config_start = template_content.find('const myCustomConfig = ')
            if config_start == -1:
                return {"error": "Could not find configuration section in template file"}, 500
            
            config_end = template_content.find('// End of configuration', config_start)
            if config_end == -1:
                # Try alternative markers
                for marker in ['// Immediately-invoked function expression', '// IIFE', '// Main code begins']:
                    config_end = template_content.find(marker, config_start)
                    if config_end != -1:
                        break
                
                if config_end == -1:
                    # If no marker found, find the next semicolon and line break
                    semi_colon = template_content.find(';', config_start + 20)
                    if semi_colon != -1:
                        config_end = template_content.find('\n', semi_colon)
                        if config_end == -1:
                            config_end = semi_colon + 1
                    else:
                        return {"error": "Could not find end of configuration section in template file"}, 500
            
            # Pretty-print the JSON configuration object
            pretty_config = "const myCustomConfig = " + json.dumps(new_config, indent=2) + ";\n"
            
            # Create the updated content
            updated_content = template_content[:config_start] + pretty_config + template_content[config_end:]
            
            # Upload the updated file to S3
            self.s3.put_object(
                Bucket=self.s3_bucket,
                Key=key,
                Body=updated_content,
                ContentType='application/javascript',
                CacheControl='max-age=3600, s-maxage=86400, public',  # Improved cache control
                Metadata={
                    'upload-time': str(int(time.time())),
                    'upload-date': datetime.now().isoformat(),
                    'source': 'template'
                }
            )
            
            # Create CloudFront Invalidation for this specific file
            try:
                invalidation = self.cf.create_invalidation(
                    DistributionId=self.cloudfront_distribution_id,
                    InvalidationBatch={
                        'Paths': {
                            'Quantity': 1,
                            'Items': [f'/{key}']  # Path to invalidate with the provided key
                        },
                        'CallerReference': str(time.time())  # Unique reference
                    }
                )
                
                # Log the invalidation ID
                print(f"CloudFront Invalidation created for {key}: {invalidation['Invalidation']['Id']}")
                
                return {
                    "message": f"Bot configuration updated successfully in {key} using template",
                    "timestamp": datetime.now().isoformat(),
                    "updated_file": key,
                    "cloudfront_invalidation_id": invalidation['Invalidation']['Id'],
                    "template_used": os.path.basename(self.template_path)
                }, 200
            
            except Exception as cloudfront_error:
                print(f"CloudFront Invalidation Error: {str(cloudfront_error)}")
                # Return success even if invalidation fails
                return {
                    "message": f"Bot configuration updated successfully in {key} using template (CloudFront invalidation failed)",
                    "timestamp": datetime.now().isoformat(),
                    "updated_file": key,
                    "template_used": os.path.basename(self.template_path),
                    "error": str(cloudfront_error)
                }, 200
                
        except Exception as e:
            print(f"Error in update_bot_config: {str(e)}")
            return {"error": f"Operation failed: {str(e)}"}, 500
        
    def delete_bot(self, key):
        """
        Delete a bot file from S3 and its associated CloudFront distribution
        
        Parameters:
        - key (str): The S3 key (filename) of the bot to delete
        
        Returns:
        - dict: Response with status information
        - int: HTTP status code
        """
        try:
            # Step 1: Delete the file from S3
            try:
                self.s3.delete_object(
                    Bucket=self.s3_bucket,
                    Key=key
                )
                s3_deletion_success = True
            except Exception as s3_error:
                s3_deletion_success = False
                s3_error_message = str(s3_error)
            
            # Step 2: Find associated CloudFront distribution
            # First, check if this bot has a unique distribution or uses the main one
            
            # Get list of all distributions
            distributions = []
            next_marker = None
            
            while True:
                if next_marker:
                    response = self.cf.list_distributions(Marker=next_marker)
                else:
                    response = self.cf.list_distributions()
                
                if 'DistributionList' in response and 'Items' in response['DistributionList']:
                    distributions.extend(response['DistributionList']['Items'])
                
                if 'DistributionList' in response and 'IsTruncated' in response['DistributionList'] and response['DistributionList']['IsTruncated']:
                    next_marker = response['DistributionList']['NextMarker']
                else:
                    break
            
            # Find distributions that have our bucket as origin
            matching_distributions = []
            for dist in distributions:
                if 'Origins' in dist and 'Items' in dist['Origins']:
                    for origin in dist['Origins']['Items']:
                        # Check if origin domain name matches our bucket
                        if origin.get('DomainName', '').startswith(f"{self.s3_bucket}.s3"):
                            # Found a distribution using our bucket
                            matching_distributions.append({
                                'id': dist['Id'],
                                'domainName': dist['DomainName'],
                                'status': dist['Status'],
                                'enabled': dist['Enabled']
                            })
            
            # If it's a unique bot (with UUID-style name), try to find its specific distribution
            cf_deletion_results = []
            
            if "-" in key and len(key) > 20:  # Likely a UUID-style bot file
                bot_id = key.split('.')[0]  # Get the part before .js
                
                for dist in matching_distributions:
                    dist_id = dist['id']
                    
                    # Get the distribution config to check Comment field
                    dist_config = self.cf.get_distribution_config(Id=dist_id)
                    
                    # Check if this distribution's comment mentions our bot
                    if 'DistributionConfig' in dist_config and 'Comment' in dist_config['DistributionConfig']:
                        comment = dist_config['DistributionConfig']['Comment']
                        
                        # If the distribution was created for this bot specifically
                        if bot_id in comment or key in comment:
                            # This is likely our bot's distribution, disable it
                            if dist['enabled']:
                                try:
                                    # Disable the distribution (required before deletion)
                                    etag = dist_config['ETag']
                                    config = dist_config['DistributionConfig']
                                    config['Enabled'] = False
                                    
                                    self.cf.update_distribution(
                                        Id=dist_id,
                                        IfMatch=etag,
                                        DistributionConfig=config
                                    )
                                    
                                    cf_deletion_results.append({
                                        'distribution_id': dist_id,
                                        'status': 'disabled',
                                        'message': 'Distribution disabled successfully, it will be deleted automatically in background'
                                    })
                                    
                                    # Note: You cannot immediately delete a CloudFront distribution
                                    # You must disable it first, then wait for it to be deployed globally
                                    # Then you can delete it (which requires a separate process)
                                    
                                except Exception as cf_error:
                                    cf_deletion_results.append({
                                        'distribution_id': dist_id,
                                        'status': 'error',
                                        'message': f'Error disabling distribution: {str(cf_error)}'
                                    })
            
            # If we deleted from S3 but couldn't find/disable the distribution,
            # create an invalidation on the main distribution
            if s3_deletion_success and not cf_deletion_results:
                try:
                    invalidation = self.cf.create_invalidation(
                        DistributionId=self.cloudfront_distribution_id,
                        InvalidationBatch={
                            'Paths': {
                                'Quantity': 1,
                                'Items': [f'/{key}']  # Path to invalidate with the provided key
                            },
                            'CallerReference': str(time.time())  # Unique reference
                        }
                    )
                    
                    cf_deletion_results.append({
                        'distribution_id': self.cloudfront_distribution_id,
                        'status': 'invalidated',
                        'invalidation_id': invalidation['Invalidation']['Id'],
                        'message': 'Created invalidation for the file'
                    })
                except Exception as cf_error:
                    cf_deletion_results.append({
                        'status': 'error',
                        'message': f'Error creating invalidation: {str(cf_error)}'
                    })
            
            # Prepare result
            result = {
                'message': 'Bot deletion processed',
                'key': key,
                's3_deletion': {
                    'success': s3_deletion_success,
                    'bucket': self.s3_bucket
                },
                'cloudfront': {
                    'actions': cf_deletion_results
                }
            }
            
            if not s3_deletion_success:
                result['s3_deletion']['error'] = s3_error_message
                return result, 500
            
            return result, 200
            
        except Exception as e:
            print(f"Error in delete_bot: {str(e)}")
            return {"error": f"Operation failed: {str(e)}"}, 500

    def download_current_bot(self, key='bot.js', save_path=None):
        """
        Download the current bot JS file from S3
        
        Parameters:
        - key (str): The S3 key of the bot to download
        - save_path (str): Optional path to save the file locally
        
        Returns:
        - dict: Response with status information
        - int: HTTP status code
        """
        try:
            # Get the file from S3
            response = self.s3.get_object(
                Bucket=self.s3_bucket,
                Key=key
            )
            
            # Read the content
            content = response['Body'].read().decode('utf-8')
            
            # Save to file if path provided
            if save_path:
                with open(save_path, 'w', encoding='utf-8') as file:
                    file.write(content)
                return {
                    "message": f"Bot downloaded and saved to {save_path}",
                    "size": len(content),
                    "content_type": response.get('ContentType', 'unknown'),
                    "last_modified": response.get('LastModified', '').isoformat() if response.get('LastModified') else None
                }, 200
            else:
                return {
                    "message": "Bot downloaded successfully",
                    "content": content,
                    "size": len(content),
                    "content_type": response.get('ContentType', 'unknown'),
                    "last_modified": response.get('LastModified', '').isoformat() if response.get('LastModified') else None
                }, 200
            
        except ClientError as e:
            if e.response['Error']['Code'] == 'NoSuchKey':
                return {"error": f"The file with key '{key}' does not exist in bucket '{self.s3_bucket}'"}, 404
            else:
                return {"error": f"S3 error: {str(e)}"}, 500
        except Exception as e:
            return {"error": f"Operation failed: {str(e)}"}, 500