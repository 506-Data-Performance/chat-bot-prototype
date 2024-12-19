"""
Contains method for loading some configuration in a json file in the data folder
"""
import json
import os
import pathlib
import typing

BASE_DIRECTORY_NAME = "flasktemplate"


def load_config(config_filename: str) -> typing.Any:
    """
    Loads the contents of a json config file from the data folder
    @param config_filename: Name of the config file
    @return: Config dictionary
    """
    file_path = get_base_path()
    full_path = os.path.join(file_path, "src", "data", config_filename)
    if not os.path.exists(full_path):
        raise Exception("Cannot find the config file in the data folder!")
    with open(full_path, "r", encoding="utf-8") as json_file:
        return json.load(json_file)


def get_base_path() -> str:
    """
    Returns the path for the main project directory. In this case it is called 'flasktemplate'
    @return: Absolute path of the main project directory
    """
    current_filepath_orig = pathlib.Path(__file__)
    current_filepath = pathlib.Path(__file__)
    while current_filepath.stem != BASE_DIRECTORY_NAME:
        current_filepath = current_filepath.parent
        if current_filepath.stem == "":
            raise Exception(
                f"Path for content source could not be found: {current_filepath_orig}!"
            )
    return str(current_filepath)
