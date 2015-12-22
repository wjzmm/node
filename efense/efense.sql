/*
Navicat MySQL Data Transfer

Source Server         : myPc
Source Server Version : 50520
Source Host           : localhost:3306
Source Database       : efense

Target Server Type    : MYSQL
Target Server Version : 50520
File Encoding         : 65001

Date: 2015-11-05 23:15:39
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `fense`
-- ----------------------------
DROP TABLE IF EXISTS `fense`;
CREATE TABLE `fense` (
  `id` int(10) unsigned NOT NULL DEFAULT '0',
  `range` int(10) NOT NULL,
  `diff` double(10,0) NOT NULL,
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of fense
-- ----------------------------

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(24) NOT NULL,
  `password` varchar(24) NOT NULL,
  `time` datetime DEFAULT NULL,
  `fense_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'uname', 'passwd', '2015-11-05 22:34:51', '0');
INSERT INTO `user` VALUES ('2', 'ire', '664', '2015-11-05 22:37:02', '0');
