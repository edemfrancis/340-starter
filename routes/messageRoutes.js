const express = require("express");
const router = new express.Router();
const messageController = require("../controllers/msgController");
const utilities = require("../utilities");
const validate = require("../utilities/message-validation");

router
	.get(
		"/",
		utilities.isAuthorizedToViewInbox,
		utilities.handleErrors(messageController.buildInbox)
	)
	.get(
		"/archive",
		utilities.isAuthorizedToViewInbox,
		utilities.handleErrors(messageController.buildArchivedMessages)
	)
	.get(
		"/send",
		utilities.isAuthorizedToViewInbox,
		utilities.handleErrors(messageController.buildSendMessage)
	)
	.get(
		"/sendMessageAgain",
		utilities.isAuthorizedToViewInbox,
		utilities.handleErrors(messageController.buildSendMessage)
	)
	.post(
		"/send",
		utilities.isAuthorizedToViewInbox,
		validate.messageRules(),
		validate.checkMessageData,
		utilities.handleErrors(messageController.sendMessage)
	)
	.post(
		"/sendMessageAgain",
		utilities.isAuthorizedToViewInbox,
		validate.messageRules(),
		validate.checkMessageData,
		utilities.handleErrors(messageController.sendMessage)
	);
router
	.get(
		"/view/:message_id",
		utilities.isAuthorizedToViewInbox,
		utilities.handleErrors(messageController.buildViewMessage)
	)
	.get(
		"/reply/:message_id",
		utilities.isAuthorizedToViewInbox,
		utilities.handleErrors(messageController.buildReplyMessage)
	)
	.post(
		"/reply",
		utilities.isAuthorizedToViewInbox,
		validate.replyRules(),
		validate.checkReplyData,
		utilities.handleErrors(messageController.replyMessage)
	)
	.get(
		"/read/:message_id",
		utilities.isAuthorizedToViewInbox,
		utilities.handleErrors(messageController.readMessage)
	)
	.get(
		"/archive/:message_id",
		utilities.isAuthorizedToViewInbox,
		utilities.handleErrors(messageController.archiveMessage)
	)
	.get(
		"/delete/:message_id",
		utilities.isAuthorizedToViewInbox,
		utilities.handleErrors(messageController.deleteMessage)
	);

module.exports = router;
