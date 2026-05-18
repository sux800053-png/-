from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import os
import webbrowser

HOST = "127.0.0.1"
PORT = 8765

if __name__ == "__main__":
    root = os.path.dirname(os.path.abspath(__file__))
    os.chdir(root)
    url = f"http://{HOST}:{PORT}/pet.html"
    print(f"Serving: {root}")
    print(f"Open: {url}")
    webbrowser.open(url)
    server = ThreadingHTTPServer((HOST, PORT), SimpleHTTPRequestHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
