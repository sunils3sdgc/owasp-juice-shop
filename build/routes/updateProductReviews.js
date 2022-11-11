"use strict";
/*
 * Copyright (c) 2014-2022 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const challengeUtils = require("../lib/challengeUtils");
const challenges = require('../data/datacache').challenges;
const db = require('../data/mongodb');
const security = require('../lib/insecurity');
// vuln-code-snippet start noSqlReviewsChallenge forgedReviewChallenge
module.exports = function productReviews() {
    return (req, res, next) => {
        const user = security.authenticatedUsers.from(req); // vuln-code-snippet vuln-line forgedReviewChallenge
        db.reviews.update(// vuln-code-snippet neutral-line forgedReviewChallenge
        { _id: req.body.id }, // vuln-code-snippet vuln-line noSqlReviewsChallenge forgedReviewChallenge
        { $set: { message: req.body.message } }, { multi: true } // vuln-code-snippet vuln-line noSqlReviewsChallenge
        ).then((result) => {
            challengeUtils.solveIf(challenges.noSqlReviewsChallenge, () => { return result.modified > 1; }); // vuln-code-snippet hide-line
            challengeUtils.solveIf(challenges.forgedReviewChallenge, () => { return (user === null || user === void 0 ? void 0 : user.data) && result.original[0] && result.original[0].author !== user.data.email && result.modified === 1; }); // vuln-code-snippet hide-line
            res.json(result);
        }, (err) => {
            res.status(500).json(err);
        });
    };
};
// vuln-code-snippet end noSqlReviewsChallenge forgedReviewChallenge
//# sourceMappingURL=updateProductReviews.js.map