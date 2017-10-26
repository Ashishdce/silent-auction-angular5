const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.

const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(
    `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

// Your company name to include in the emails
// TODO: Change this to your app or company name to customize the email sent.
const APP_NAME = 'Silent Auction 2017';

// Admin emails
const ADMIN_EMAILS = ['ajangid@sapient.com']

exports.postFunctionToAuthor = functions.firestore
    .document('silent-auction/{doc}')
    .onCreate(event => {
        const data = event.data.data();
        const email = data.author_email;
        const userName = data.author_name;
        const mailOptions = {
            from: `${APP_NAME} <silentAuction@sapient.com>`,
            to: email
        };
        mailOptions.subject = `Successfully posted to ${APP_NAME}!`;
        mailOptions.text = `Hey ${userName}!
                            
                            Welcome to ${APP_NAME}. We have recieved you offer request and currently it is pending for review.
                            You will be notified once it is approved.

                            Thanks.
                            Silent Auction Team`;
        return mailTransport.sendMail(mailOptions).then(() => {
            console.log('New welcome email sent to:', email);
        });
    });

exports.postFunctionToAdmin = functions.firestore
    .document('silent-auction/{doc}')
    .onCreate(event => {
        const data = event.data.data();
        const email = data.author_email;
        const userName = data.author_name;
        const mailOptions = {
            from: `${APP_NAME} <silentAuction@sapient.com>`,
            to: ADMIN_EMAILS
        };
        mailOptions.subject = `Successfully posted to ${APP_NAME}!`;
        mailOptions.text = `Hey Admins! 
                            
                            A new offer has been revieved from ${userName}. Kindly review it.

                            Thanks.
                            Silent Auction Team`;
        return mailTransport.sendMail(mailOptions).then(() => {
            console.log('New welcome email sent to:', email);
        });
    });

exports.deleteFunction = functions.firestore
    .document('silent-auction/{doc}')
    .onDelete(event => {
        const data = event.data.previous.data();
        const email = data.author_email;
        const userName = data.author_name;
        const mailOptions = {
            from: `${APP_NAME} <silentAuction@sapient.com>`,
            to: email,
            bcc: ADMIN_EMAILS
        };
        mailOptions.subject = `Successfully Deleted Offer || ${APP_NAME}`;
        mailOptions.text = `Hey ${userName}! Welcome to ${APP_NAME}. Your offer with name ${data.name} has been successfully deleted.

                            Thanks.
                            Silent Auction Team`;
        return mailTransport.sendMail(mailOptions).then(() => {
            console.log('New welcome email sent to:', email);
        });
    });
exports.updateFunction = functions.firestore
    .document('silent-auction/{doc}')
    .onUpdate(event => {
        const data = event.data.data();
        const prevData = event.data.previous.data();
        const email = data.author_email;

        if (data.status !== prevData.status) {
            const userName = data.name;
            const mailOptions = {
                from: `${APP_NAME} <silentAuction@sapient.com>`,
                to: email
            };
            mailOptions.subject = `Offer Approved || ${APP_NAME}`;
            mailOptions.text = `Hey ${userName}! 

                                Greetings from Silent Auction Team. We are happy to tell you that your offer named ${data.name} has been approved.
                                
                                Cheers!.
                                Silent Auction Team`;
            return mailTransport.sendMail(mailOptions).then(() => {
                console.log('New welcome email sent to:', email);
            });
        } else if (data.bid_count !== prevData.bid_count) {
            const userName = data.name;
            const mailOptions = {
                from: `${APP_NAME} <silentAuction@sapient.com>`,
                to: email
            };
            mailOptions.subject = `A New Bid Placed || ${APP_NAME}`;
            mailOptions.text = `Hey ${userName}! 

                                A new higher bid has been made upon your offer named ${data.name}.
                                
                                Cheers!.
                                Silent Auction Team`;
            return mailTransport.sendMail(mailOptions).then(() => {
                console.log('New welcome email sent to:', email);
            });
        } else {
            const userName = data.name;
            const mailOptions = {
                from: `${APP_NAME} <silentAuction@sapient.com>`,
                to: email,
                bcc: ADMIN_EMAILS
            };
            mailOptions.subject = `Successfully Updated the Offer || ${APP_NAME}`;
            mailOptions.text = `Hey ${userName}! 

                                Your offer named ${data.name} has been successfully updated.
                                
                                Cheers!.
                                Silent Auction Team`;
            return mailTransport.sendMail(mailOptions).then(() => {
                console.log('New welcome email sent to:', email);
            });
        }
    });
exports.bidSuccessfulFunction = functions.firestore
    .document('silent-auction/{doc}/bid-collection/{bid_info}')
    .onCreate(event => {
        const data = event.data.data();
        const email = data.bidder_email;
        const userName = data.bidder_name;
        const mailOptions = {
            from: `${APP_NAME} <silentAuction@sapient.com>`,
            to: email
        };
        mailOptions.subject = `Bid Was Successful || ${APP_NAME}!`;
        mailOptions.text = `Hey ${userName}!
                            
                            Your bid has been successful. Keep Bidding!

                            Cheers.
                            Silent Auction Team`;
        return mailTransport.sendMail(mailOptions).then(() => {
            console.log('New welcome email sent to:', email);
        });
    });
// exports.higherBidMadeFunction = functions.firestore
//     .document('silent-auction/{doc}/{bid-collection}/{bid_info}')
//     .onCreate(event => {
//         const data = event.data.data();
//         event.data.re
//         const offerDoc = event.params.doc;
//         // functions. document(`silent-auction/${offerDoc}`).
//         const userName = data.bidder_name;
//         const mailOptions = {
//             from: `${APP_NAME} <silentAuction@sapient.com>`,
//             to: email
//         };
//         mailOptions.subject = `You were OUTBID || ${APP_NAME}!`;
//         mailOptions.text = `Hey ${userName}!

//                             Someone has bidded higher than you..! Bid back harder before its too late!

//                             Cheers.
//                             Silent Auction Team`;
//         return mailTransport.sendMail(mailOptions).then(() => {
//             console.log('New welcome email sent to:', email);
//         });
//     });