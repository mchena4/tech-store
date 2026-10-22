"""
WSGI application entrypoint compatibility alias for platforms defaulting to 'gunicorn app:app'.
"""
from apiProject.wsgi import application

app = application
