cd /etc/openvpn/
echo "killall openvpn"
killall openvpn # <<<< disconnect
echo "sleep 30"
sleep 30 # <<<< wait a bit more to make sure that the openvpn has been properly disconnected 
echo "openvpn --daemon --config Brazil.JoaoPessoa.UDP.ovpn"
openvpn --daemon --config Brazil.JoaoPessoa.UDP.ovpn # <<<< change the config file string to match your prefered server
