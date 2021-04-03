cd /etc/openvpn/
killall openvpn # <<<< disconnect
sleep 30 # <<<< wait a bit more to make sure that the openvpn has been properly disconnected 
openvpn --daemon --config Brazil.JoaoPessoa.UDP.ovpn # <<<< change the config file string to match your prefered server
