#!/bin/bash
sudo apt-get install -y apache2 php5.6 php5.6-curl
sudo a2enmod rewrite
sudo service apache2 restart