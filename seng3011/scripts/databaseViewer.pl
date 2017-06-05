#!/usr/bin/perl -w
#
# databaseViewer.pl 
#
# Orion Larden, z5061967
# 10/04/17 
#
# <<TODO DESCRIPTION>>
$in = $ARGV[0] || 0;

if ($in eq 'a') {
    print `echo 'db.log.find().pretty()' | meteor mongo`;
} elsif ($in eq 'c') {
    print `echo 'db.log.count()' | meteor mongo`;
} elsif ($in eq 'f') {
    print `echo 'db.log.find({call_result:"failure"}).pretty()' | meteor mongo`;
} elsif ($in eq 'i') {
    print `echo 'db.log.find({}, {user_ip: 1, user_agent: 1, _id: 0}).pretty()' | meteor mongo`; 
} elsif ($in eq 'x') {
    `echo 'db.log.deleteMany({})' | meteor mongo`;
} else {
    print "Usage: $0 [option]\nOptions:\na - all logs\nc - number of logs\nf - failed calls\ni - ip and user agent\nx - delete all logs\n";
}
