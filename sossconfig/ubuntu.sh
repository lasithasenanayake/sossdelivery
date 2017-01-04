#!/bin/bash
add-apt-repository ppa:ondrej/php
apt-get update
 apt-get install -y apache2 php5.6 php5.6-curl
 a2enmod rewrite
 service apache2 restart
 debconf-set-selections <<< 'mysql-server mysql-server/root_password password sossgrid'
 debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password sossgrid'
 apt-get -y install mysql-server
add-apt-repository ppa:webupd8team/java
apt-get update
apt-get install oracle-java8-installer
mkdir /var/images
chmod 0777 /var/images
mkdir /usr/bin/sossgrid
cd /usr/bin/sossgrid
wget https://github.com/lasithasenanayake/springauth/releases/download/1.0.0.1/auth-0.0.1-SNAPSHOT.jar
chmod 0777 auth-0.0.1-SNAPSHOT.jar
echo '#!/bin/bash' > /etc/init.d/sossauth.sh
echo 'cd /usr/bin/sossgrid/' >> /etc/init.d/sossauth.sh
echo 'java -jar auth-0.0.1-SNAPSHOT.jar' >> /etc/init.d/sossauth.sh
chmod 0777 /etc/init.d/sossauth.sh
ln -s /etc/init.d/sossauth.sh /etc/rc2.d/S07sossauth.sh
#ln -s /etc/init.d/sossauth.sh /etc/rc5.d/S07sossauth.sh
