"""shipany URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
import sys

from django.conf.urls import url
from shipany.order_contract.views import OrderContractView
from rest_framework.routers import DefaultRouter
from shipany.common import logger
from shipany.settings import *

router = DefaultRouter()
router.register(r'order-contracts', OrderContractView)

urlpatterns = [
    url(r'^', include(router.urls)),
]

urlpatterns.append(url(r'^docs/', include('rest_framework_swagger.urls')))
