from django.conf import settings
from django.http import HttpResponseForbidden
from data_analysis.views import forbidden_access_view 

class IPWhiteListMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.allowed_ips = getattr(settings, "ALLOWED_IPS", [])

    def __call__(self, request):
        ip_address = request.META.get("REMOTE_ADDR")

        if ip_address not in self.allowed_ips:
            return forbidden_access_view(request)

        response = self.get_response(request)
        return response
