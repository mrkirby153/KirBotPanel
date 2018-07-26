#!/bin/sh

# If you would like to do some extra provisioning you may
# add any commands you wish to this file and they will
# be run after the Homestead machine is provisioned.

# Open up redis to all interfaces
sudo sed -i -e "s/bind/#bind/g" -e "s/protected-mode yes/protected-mode no/g" /etc/redis/redis.conf
sudo systemctl restart redis.service