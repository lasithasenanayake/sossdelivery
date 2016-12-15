#!/bin/bash
 apt-get install -y apache2 php5.6 php5.6-curl
 a2enmod rewrite
 service apache2 restart
 
 debconf-set-selections <<< 'mysql-server mysql-server/root_password password sossgrid'
 debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password sossgrid'
 apt-get -y install mysql-server


add-apt-repository ppa:webupd8team/java
apt-get update
apt-get install oracle-java8-installer