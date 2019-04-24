# -*- coding: utf-8 -*-:

# standard library imports
import json

# related third party imports
from rest_framework import status
from rest_framework.response import Response

# local application/library specific imports
from logger import Logger



def get_generic_resp_full(code, descr="", details=[], objects=[], query_tk={}):
    result = {}
    result['code'] = code

    if "" != descr:
        result['descr'] = descr

    if details:
        result['details'] = details

    data = {}

    if objects:
        data['objects'] = objects

    if query_tk:
        data['query_tk'] = query_tk

    resp = {}
    resp['result'] = result

    if data:
        resp['data'] = data

    return resp

def get_generic_resp_rslt_only(code, descr = "", details = []):
    result = {}
    result['code'] = code

    if "" != descr:
        result['descr'] = descr

    if details:
        result['details'] = details

    resp = {}

    if result:
        resp['result'] = result

    return resp

def pretty_print_json(input):
    if not isinstance(input, dict) and not isinstance(input, list):
        log_msg = ("Failed to pretty print '" + str(input)
                   + "' because it's not a dict or a list")
        Logger.warn(log_msg)
        return

    print json.dumps(
        input, indent = 2, sort_keys = True, separators = (',', ':'))

def get_pretty_json(input):
    if not isinstance(input, dict) and not isinstance(input, list):
        log_msg = ("Failed to get pretty json '" + str(input)
                   + "' because it's not a dict or a list")
        Logger.warn(log_msg)
        return

    return json.dumps(
        input, indent = 2, sort_keys = True, separators = (',', ':'))
