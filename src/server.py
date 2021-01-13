import signal
import atexit
import zerorpc
from time import sleep
from pyaxidraw import axidraw

class someBasicClass():
    def handshake(self):
        return True

    def goto(self, x, y):
        ad.goto(x, y)
        return True

    def penup(self):
        ad.penup()
        sleep(0.1)
        
        return True

    def pendown(self):
        ad.pendown()
        sleep(0.1)
        return True

    def disable(self):
        ad.plot_setup()
        ad.options.mode = "align"
        ad.plot_run()
        return True
    
    def disconnect(self):
        ad.disconnect()
        return True


def onclose():
    ad.plot_setup()
    ad.options.mode = "align"
    ad.plot_run()
    ad.disconnect()

try:
    signal.signal(signal.SIGINT, onclose)
    signal.signal(signal.SIGTERM, onclose)
    atexit.register(onclose)

    ad = axidraw.AxiDraw()
    ad.interactive()
    ad.connect()
    ad.options.units = 1

    server = zerorpc.Server(someBasicClass())
    server.bind('tcp://0.0.0.0:4242')
    server.run()
finally:
    onclose()