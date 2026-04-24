import logging

logger = logging.getLogger(__name__)


class BulletproofCORSMiddleware:
    """
    Handles CORS at the lowest possible level.
    Works even when other middleware fails.
    """

    ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178",
        "http://localhost:5179",
        "http://localhost:5180",
        "http://localhost:5181",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5180",
    ]

    ALLOW_HEADERS = (
        "accept, accept-encoding, authorization, content-type, "
        "dnt, origin, user-agent, x-csrftoken, x-requested-with"
    )

    ALLOW_METHODS = "GET, POST, PUT, PATCH, DELETE, OPTIONS"

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        origin = request.META.get("HTTP_ORIGIN", "")

        # ── Handle preflight immediately before any other processing ──
        if request.method == "OPTIONS":
            response = self._preflight_response(origin)
            return response

        # ── Process the actual request ──
        response = self.get_response(request)

        # ── Add CORS headers to every response ──
        self._add_cors_headers(response, origin)

        return response

    def _preflight_response(self, origin: str):
        from django.http import HttpResponse

        response = HttpResponse(status=200)
        self._add_cors_headers(response, origin)
        return response

    def _add_cors_headers(self, response, origin: str):
        # Allow the requesting origin or wildcard
        if origin in self.ALLOWED_ORIGINS:
            response["Access-Control-Allow-Origin"] = origin
        else:
            response["Access-Control-Allow-Origin"] = "*"

        response["Access-Control-Allow-Methods"] = self.ALLOW_METHODS
        response["Access-Control-Allow-Headers"] = self.ALLOW_HEADERS
        response["Access-Control-Allow-Credentials"] = "true"
        response["Access-Control-Max-Age"] = "86400"
        response["Vary"] = "Origin"