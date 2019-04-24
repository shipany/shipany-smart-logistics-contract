# local application/library specific imports
from shipany.common import serializers as ser
from shipany.order_contract.models import OrderContract

class OrderContractSerializer(ser.ExtendedModelSerializer):
    class Meta:
        model = OrderContract
