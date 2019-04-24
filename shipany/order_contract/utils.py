# -*- coding: utf-8 -*-
# standard library imports
import json

# standard library imports
from os.path import dirname, abspath

# local application/library specific imports
from shipany.common.logger import Logger

BASE_DIR = dirname(dirname(dirname(abspath(__file__)))) + "/"
Logger.info("Current base directory path: " + BASE_DIR)

NODE_APP_PATH = "shipany-order/application/issue.js"
EXTRACT_SLIT_DELIMITER = "[main::output] "



def extract_from_nodejs(input):
    input_lines = input.split("\n")
    output = {}

    for line in input_lines:
        if EXTRACT_SLIT_DELIMITER not in line:
            continue

        split_rslt = line.split(EXTRACT_SLIT_DELIMITER)

        if len(split_rslt) < 2:
            continue

        try:
            output = json.loads(split_rslt[1])
        except Exception as e:
            Logger.warn("Failed to parse contract response. Reason: " + str(e))
            Logger.warn("Order: " + str(output) + "; resp_lines" + str(input))
            return output

        break

    return output
