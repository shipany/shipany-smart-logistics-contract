# standard library imports
import inspect
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# create console handler
ch = logging.StreamHandler()
ch.setLevel(logging.WARNING)

# create formatter
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
# add formatter to ch
ch.setFormatter(formatter)

# add ch to logger
logger.addHandler(ch)

class Logger():
    @classmethod
    def debug(cls, msg):
        frame = inspect.stack()[1]

        caller_file_path = frame[1]
        line_num_str = str(frame[2])
        func_name = frame[3]

        if isinstance(msg, dict):
            msg = json.dumps(msg)
        else:
            msg = str(msg)

        log_msg = (caller_file_path + ":" + line_num_str + ", [" + func_name
                   + "] " + msg)
        logger.debug(log_msg)

    @classmethod
    def info(cls, msg):
        frame = inspect.stack()[1]

        caller_file_path = frame[1]
        line_num_str = str(frame[2])
        func_name = frame[3]

        if isinstance(msg, dict):
            msg = json.dumps(msg)
        else:
            msg = str(msg)

        log_msg = (caller_file_path + ":" + line_num_str + ", [" + func_name
                   + "] " + msg)
        logger.info(log_msg)

    @classmethod
    def warn(cls, msg):
        frame = inspect.stack()[1]

        caller_file_path = frame[1]
        line_num_str = str(frame[2])
        func_name = frame[3]

        if isinstance(msg, dict):
            msg = json.dumps(msg)
        else:
            msg = str(msg)

        log_msg = (caller_file_path + ":" + line_num_str + ", [" + func_name
                   + "] " + msg)
        logger.warn(log_msg)

    @classmethod
    def error(cls, msg):
        frame = inspect.stack()[1]

        caller_file_path = frame[1]
        line_num_str = str(frame[2])
        func_name = frame[3]

        if isinstance(msg, dict):
            msg = json.dumps(msg)
        else:
            msg = str(msg)

        log_msg = (caller_file_path + ":" + line_num_str + ", [" + func_name
                   + "] " + msg)
        logger.error(log_msg)
