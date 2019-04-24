# -*- coding: utf-8 -*-

# standard library imports
import subprocess

# related third party imports
from rest_framework import status
from rest_framework.decorators import (list_route, permission_classes)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

# local application/library specific imports
from shipany.common import utils as commUtils
from shipany.common.logger import Logger
from shipany.common.typedef import ShipAnyHTTPMessage as HttpMsg
from shipany.order_contract.models import OrderContract
from shipany.order_contract.serializers import OrderContractSerializer
from shipany.order_contract.utils import BASE_DIR
from shipany.order_contract.utils import extract_from_nodejs
from shipany.order_contract.utils import NODE_APP_PATH


class OrderContractView(ModelViewSet):
    queryset = OrderContract.objects.all()
    serializer_class = OrderContractSerializer
    lookup_field = 'contract_id'

    def retrieve(self, request, contract_id):
        contract_resp = subprocess.check_output(
            ["node", BASE_DIR + NODE_APP_PATH, "get", contract_id])
        output = extract_from_nodejs(contract_resp)

        if not output:
            resp = commUtils.get_generic_resp_rslt_only(
                status.HTTP_404_NOT_FOUND, descr=HttpMsg.GENERIC_RESP_DESCR_NOT_FOUND)
            resp = Response(resp, status=resp['result']['code'])
            return resp
        
        objects = []
        objects.append(output)
        resp = commUtils.get_generic_resp_full(
            status.HTTP_200_OK, objects=objects,
            descr=HttpMsg.GENERIC_RESP_DESCR_OK)
        resp = Response(resp, status=resp['result']['code'])
        return resp

    def destroy(self, request, contract_id):
        foo = subprocess.check_output(["node", BASE_DIR + NODE_APP_PATH, "delete", contract_id])
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

    def partial_update(self, request, contract_id):
        return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

    def update(self, request, contract_id):
        """
        Update a ShipAny order contract in the blockchain network
        ---
        omit_serializer: true
        parameters:
        - name: body
          pytype: OrderContractSerializer
          paramType: body
        """

        contract_resp = subprocess.check_output(
            ["node", BASE_DIR + NODE_APP_PATH, "update", contract_id, request.body])
        output = extract_from_nodejs(contract_resp)

        resp = commUtils.get_generic_resp_full(
            status.HTTP_200_OK, descr=HttpMsg.GENERIC_RESP_DESCR_OK)
        resp = Response(resp, status=resp['result']['code'])
        return resp

    def list(self, request):
        contract_resp = subprocess.check_output(
            ["node", BASE_DIR + NODE_APP_PATH, "list"])
        output = extract_from_nodejs(contract_resp)
        objects = []

        if output:
            if isinstance(output, list):
                for item in output:
                    objects.append(item)
            else:
                objects.append(str(output))

        resp = commUtils.get_generic_resp_full(
            status.HTTP_200_OK, objects=objects,
            descr=HttpMsg.GENERIC_RESP_DESCR_OK)
        resp = Response(resp, status=resp['result']['code'])
        return resp

    def create(self, request):
        """
        Create a ShipAny order contract in the blockchain network
        ---
        omit_serializer: true
        parameters:
        - name: body
          pytype: OrderContractSerializer
          paramType: body
        """
        contract_resp = subprocess.check_output(
            ["node", BASE_DIR + NODE_APP_PATH, "add", request.body])
        output = extract_from_nodejs(contract_resp)

        if not output:
            Logger.warn("Failed to create order. Input: " + request.body)
            resp = commUtils.get_generic_resp_rslt_only(
                status.HTTP_400_BAD_REQUEST,
                descr=HttpMsg.GENERIC_RESP_DESCR_BAD_REQ)
            resp = Response(resp, status=resp['result']['code'])
            return resp
        
        objects = []
        objects.append(output)
        resp = commUtils.get_generic_resp_full(
            status.HTTP_201_CREATED, objects=objects,
            descr=HttpMsg.GENERIC_RESP_DESCR_CREATED)
        resp = Response(resp, status=resp['result']['code'])
        return resp

    @list_route(methods=['get'], url_path='get-contract-history')
    def get_history(self, request):
        """
        Get basic statistics
        ---
        omit_serializer: True
        parameters:
        - name: contract_id
          type: string
          required: True
          paramType: query
          description: Contract id
        """

        contract_id = request.query_params.get('contract_id')
        contract_resp = subprocess.check_output(
            ["node", BASE_DIR + NODE_APP_PATH, "getHistory", contract_id])
        output = extract_from_nodejs(contract_resp)

        if not output:
            resp = commUtils.get_generic_resp_rslt_only(
                status.HTTP_404_NOT_FOUND, descr=HttpMsg.GENERIC_RESP_DESCR_NOT_FOUND)
            resp = Response(resp, status=resp['result']['code'])
            return resp
        
        objects = []
        objects.append(output)
        resp = commUtils.get_generic_resp_full(
            status.HTTP_200_OK, objects=objects,
            descr=HttpMsg.GENERIC_RESP_DESCR_OK)
        resp = Response(resp, status=resp['result']['code'])
        return resp
