/******/ var __webpack_modules__ = ({

/***/ "./src/background/api.ts":
/*!*******************************!*\
  !*** ./src/background/api.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sendAnswerRequest: () => (/* binding */ sendAnswerRequest),
/* harmony export */   sendIsQuizRequest: () => (/* binding */ sendIsQuizRequest),
/* harmony export */   sendParseQuestionsRequest: () => (/* binding */ sendParseQuestionsRequest)
/* harmony export */ });
/* harmony import */ var _constants_supabase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/supabase */ "./src/constants/supabase.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

function sendAnswerRequest(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield fetch(_constants_supabase__WEBPACK_IMPORTED_MODULE_0__.ANSWER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
        });
        if (!resp.ok) {
            throw new Error(`Answer API error: ${resp.status} ${resp.statusText}`);
        }
        return (yield resp.json());
    });
}
function sendIsQuizRequest(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield fetch(_constants_supabase__WEBPACK_IMPORTED_MODULE_0__.IS_QUIZ_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
        });
        if (!resp.ok) {
            if (resp.status === 402) {
                throw new Error('PAYMENT_REQUIRED');
            }
            throw new Error(`IsQuiz API error: ${resp.status} ${resp.statusText}`);
        }
        const result = (yield resp.json());
        return result;
    });
}
function sendParseQuestionsRequest(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield fetch(_constants_supabase__WEBPACK_IMPORTED_MODULE_0__.PARSE_QUESTIONS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
        });
        if (!resp.ok) {
            if (resp.status === 402) {
                throw new Error('PAYMENT_REQUIRED');
            }
            throw new Error(`ParseQuestions API error: ${resp.status} ${resp.statusText}`);
        }
        const result = (yield resp.json());
        // Map to the simplified IsQuizResponse (no summary, cmId only)
        return {
            isQuiz: true,
            questions: result.questions.map(q => ({ cmId: String(q.cmId) }))
        };
    });
}


/***/ }),

/***/ "./src/background/handlers/answer.ts":
/*!*******************************************!*\
  !*** ./src/background/handlers/answer.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleAnswerQuestion: () => (/* binding */ handleAnswerQuestion)
/* harmony export */ });
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api */ "./src/background/api.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

function handleAnswerQuestion(_a) {
    return __awaiter(this, arguments, void 0, function* ({ html, quizSummary, fingerPrint, sendResponse }) {
        chrome.storage.local.get(['email', 'userId'], ({ email, userId }) => {
            (() => __awaiter(this, void 0, void 0, function* () {
                try {
                    // Validate that we have both email and userId
                    if (!email || !userId) {
                        // Open extension popup/login page instead of sending error response
                        try {
                            yield chrome.action.openPopup();
                        }
                        catch (error) {
                        }
                        sendResponse({
                            success: false,
                            error: 'Please log in using the extension popup to continue.'
                        });
                        return;
                    }
                    const data = yield (0,_api__WEBPACK_IMPORTED_MODULE_0__.sendAnswerRequest)({
                        html,
                        quizSummary,
                        email,
                        userId,
                        fingerPrint
                    });
                    sendResponse({ success: true, data });
                }
                catch (err) {
                    sendResponse({ success: false, error: err.message });
                }
            }))();
        });
    });
}


/***/ }),

/***/ "./src/background/handlers/auth.ts":
/*!*****************************************!*\
  !*** ./src/background/handlers/auth.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleAuthStateChange: () => (/* binding */ handleAuthStateChange)
/* harmony export */ });
function handleAuthStateChange({ email, userId, customerId, loggedInNew, }) {
    const storageData = {};
    const keysToRemove = [];
    // Handle email
    if (email === null) {
        keysToRemove.push('email');
    }
    else if (email) {
        storageData.email = email;
    }
    // Handle userId
    if (userId === null) {
        keysToRemove.push('userId');
    }
    else if (userId) {
        storageData.userId = userId;
    }
    // Handle customerId
    if (customerId === null) {
        keysToRemove.push('customerId');
    }
    else if (customerId) {
        storageData.customerId = customerId;
    }
    // Handle loggedInNew
    if (loggedInNew === null) {
        keysToRemove.push('loggedInNew');
    }
    else if (loggedInNew !== undefined) {
        storageData.loggedInNew = loggedInNew;
    }
    // Set new/updated data
    if (Object.keys(storageData).length > 0) {
        chrome.storage.local.set(storageData, () => {
        });
    }
    // Remove null keys
    if (keysToRemove.length > 0) {
        chrome.storage.local.remove(keysToRemove, () => {
        });
    }
}


/***/ }),

/***/ "./src/background/handlers/is-quiz.ts":
/*!********************************************!*\
  !*** ./src/background/handlers/is-quiz.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleIsQuiz: () => (/* binding */ handleIsQuiz)
/* harmony export */ });
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api */ "./src/background/api.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

function handleIsQuiz({ html, fingerPrint, provider, sendResponse }) {
    chrome.storage.local.get(['email', 'userId'], ({ email, userId }) => {
        (() => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Get current tab URL
                const [tab] = yield chrome.tabs.query({ active: true, currentWindow: true });
                const url = tab === null || tab === void 0 ? void 0 : tab.url;
                try {
                    // Minimal debug logging
                    // eslint-disable-next-line no-console
                    console.log('[CheatMate][background] POST /is-quiz', { provider, url, htmlLen: (_a = html === null || html === void 0 ? void 0 : html.length) !== null && _a !== void 0 ? _a : 0 });
                }
                catch (_b) { }
                const data = yield (0,_api__WEBPACK_IMPORTED_MODULE_0__.sendIsQuizRequest)({ html, email, userId, fingerPrint, provider, url });
                sendResponse({ success: true, data });
            }
            catch (err) {
                const errorMessage = err.message;
                try {
                    // eslint-disable-next-line no-console
                    console.warn('[CheatMate][background] /is-quiz error', { provider, error: errorMessage });
                }
                catch (_c) { }
                sendResponse({ success: false, error: errorMessage });
            }
        }))();
    });
}


/***/ }),

/***/ "./src/background/handlers/parse-questions.ts":
/*!****************************************************!*\
  !*** ./src/background/handlers/parse-questions.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleParseQuestions: () => (/* binding */ handleParseQuestions)
/* harmony export */ });
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api */ "./src/background/api.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

function handleParseQuestions({ html, fingerPrint, provider, sendResponse }) {
    chrome.storage.local.get(['email', 'userId'], ({ email, userId }) => {
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                const [tab] = yield chrome.tabs.query({ active: true, currentWindow: true });
                const url = tab === null || tab === void 0 ? void 0 : tab.url;
                try {
                }
                catch (_a) { }
                const data = yield (0,_api__WEBPACK_IMPORTED_MODULE_0__.sendParseQuestionsRequest)({ html, email, userId, fingerPrint, provider, url });
                sendResponse({ success: true, data });
            }
            catch (err) {
                const errorMessage = err.message;
                try {
                }
                catch (_b) { }
                sendResponse({ success: false, error: errorMessage });
            }
        }))();
    });
}


/***/ }),

/***/ "./src/constants/script.ts":
/*!*********************************!*\
  !*** ./src/constants/script.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   INJECT_FILE: () => (/* binding */ INJECT_FILE),
/* harmony export */   allowedUrlPatterns: () => (/* binding */ allowedUrlPatterns),
/* harmony export */   providers: () => (/* binding */ providers)
/* harmony export */ });
const INJECT_FILE = 'inject.js';
const providers = [
    {
        name: 'cheatmate',
        regex: [
            '^https://(?:www\\.)?cheatmate\\.io/onboarding.*$',
            'http://localhost:3001/*',
            'http://localhost:3000/*'
        ]
    },
    {
        name: 'googleClassroom',
        regex: [
            '^https?://docs\\.google\\.com/forms/.*(?:\\?.*)?$'
        ]
    },
    {
        name: 'd2l',
        regex: [
            '^https?://(?:[^.]+\\.)*d2l(?:\\.[^.]+)*(?:/|$)',
            '^https?://(?:[^.]+\\.)*brightspace(?:\\.[^.]+)*(?:/|$)'
        ]
    },
    {
        name: 'canvas',
        regex: [
            '^https?://(?:[^.]+\\.)*canvas(?:\\.[^.]+)*(?:/|$)',
            '^https?://(?:[^.]+\\.)*instructure(?:\\.[^.]+)*(?:/|$)'
        ]
    },
    {
        name: 'moodle',
        regex: [
            '^https?://(?:[^.]+\\.)*moodle(?:\\.[^.]+)*(?:/|$)',
            '^https?://(?:[^.]+\\.)*moodlecloud(?:\\.[^.]+)*(?:/|$)'
        ]
    },
    {
        name: 'blackboard',
        regex: [
            '^https?://(?:[^.]+\\.)*blackboard(?:\\.[^.]+)*(?:/|$)',
            '^https?://(?:[^.]+\\.)*bbhosted(?:\\.[^.]+)*(?:/|$)'
        ]
    },
    {
        name: 'schoology',
        regex: [
            '^https?://(?:[^.]+\\.)*schoology(?:\\.[^.]+)*(?:/|$)'
        ]
    },
    {
        name: 'mcgrawHill',
        regex: [
            '^https?://(?:[^.]+\\.)*mheducation(?:\\.[^.]+)*(?:/|$)',
            '^https?://(?:[^.]+\\.)*mhhe(?:\\.[^.]+)*(?:/|$)'
        ]
    },
    {
        name: 'kahoot',
        regex: [
            '^https?://(?:[^.]+\\.)*kahoot(?:\\.[^.]+)*(?:/|$)'
        ]
    },
    {
        name: 'khanAcademy',
        regex: [
            '^https?://(?:[^.]+\\.)*khanacademy(?:\\.[^.]+)*(?:/|$)'
        ]
    },
    {
        name: 'edmodo',
        regex: [
            '^https?://(?:[^.]+\\.)*edmodo(?:\\.[^.]+)*(?:/|$)'
        ]
    },
    {
        name: 'pearson',
        regex: [
            '^https?://(?:[^.]+\\.)*pearson(?:\\.[^.]+)*(?:/|$)',
            '^https?://(?:[^.]+\\.)*mylab(?:\\.[^.]+)*(?:/|$)',
            '^https?://(?:[^.]+\\.)*mastering(?:\\.[^.]+)*(?:/|$)'
        ]
    },
    {
        name: 'quizlet',
        regex: [
            '^https?://(?:[^.]+\\.)*quizlet(?:\\.[^.]+)*(?:/|$)'
        ]
    },
    {
        name: 'socrative',
        regex: [
            '^https?://(?:[^.]+\\.)*socrative(?:\\.[^.]+)*(?:/|$)'
        ]
    },
    {
        name: 'nearpod',
        regex: [
            '^https?://(?:[^.]+\\.)*nearpod(?:\\.[^.]+)*(?:/|$)'
        ]
    },
    {
        name: 'tophat',
        regex: [
            '^https?://(?:[^.]+\\.)*tophat(?:\\.[^.]+)*(?:/|$)'
        ]
    },
    {
        name: 'aleks',
        regex: [
            '^https?://(?:[^.]+\\.)*aleks(?:\\.[^.]+)*(?:/|$)'
        ]
    },
    {
        name: 'edgenuity',
        regex: [
            '^https?://(?:[^.]+\\.)*edgenuity(?:\\.[^.]+)*(?:/|$)'
        ]
    },
    {
        name: 'proprofs',
        regex: [
            '^https?://(?:[^.]+\\.)*proprofs(?:\\.[^.]+)*(?:/|$)',
            '^https?://(?:[^.]+\\.)*quiz-school(?:\\.[^.]+)*(?:/|$)'
        ]
    },
    {
        name: 'classmarker',
        regex: [
            '^https?://(?:[^.]+\\.)*classmarker(?:\\.[^.]+)*(?:/|$)'
        ]
    },
    {
        name: 'apexLearning',
        regex: [
            '^https?://(?:[^.]+\\.)*apexvs(?:\\.[^.]+)*(?:/|$)'
        ]
    },
    {
        name: 'quizizz',
        regex: [
            '^https?://(?:[^.]+\\.)*quizizz(?:\\.[^.]+)*(?:/|$)'
        ]
    },
    {
        name: 'edpuzzle',
        regex: [
            '^https?://(?:[^.]+\\.)*edpuzzle(?:\\.[^.]+)*(?:/|$)'
        ]
    },
    {
        name: 'blooket',
        regex: [
            '^https?://(?:[^.]+\\.)*blooket(?:\\.[^.]+)*(?:/|$)'
        ]
    },
    {
        name: 'other',
        regex: [
            '^.*$'
        ]
    }
];
const allowedUrlPatterns = providers.flatMap((p) => p.regex.map((pattern) => new RegExp(pattern)));


/***/ }),

/***/ "./src/constants/supabase.ts":
/*!***********************************!*\
  !*** ./src/constants/supabase.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ANSWER_URL: () => (/* binding */ ANSWER_URL),
/* harmony export */   API_URL: () => (/* binding */ API_URL),
/* harmony export */   IS_QUIZ_URL: () => (/* binding */ IS_QUIZ_URL),
/* harmony export */   PARSE_QUESTIONS_URL: () => (/* binding */ PARSE_QUESTIONS_URL),
/* harmony export */   SUPABASE_ANON_KEY: () => (/* binding */ SUPABASE_ANON_KEY),
/* harmony export */   SUPABASE_URL: () => (/* binding */ SUPABASE_URL)
/* harmony export */ });
const SUPABASE_URL = 'https://fxmqawsnrzrropeuiwqc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4bXFhd3Nucnpycm9wZXVpd3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNTEzNDQsImV4cCI6MjA2NDcyNzM0NH0.Q6bOlO9o-B0r0fWeT0ZjYA4k2jEcFeBwdLV127Gh5ss';
const API_URL = "https://api.cheatmate.io/api";
// export const API_URL = "http://localhost:3000/api"
const ANSWER_URL = API_URL + "/answer";
const IS_QUIZ_URL = API_URL + "/is-quiz";
const PARSE_QUESTIONS_URL = API_URL + "/parse-questions";


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _handlers_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./handlers/auth */ "./src/background/handlers/auth.ts");
/* harmony import */ var _handlers_answer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./handlers/answer */ "./src/background/handlers/answer.ts");
/* harmony import */ var _constants_script__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants/script */ "./src/constants/script.ts");
/* harmony import */ var _handlers_is_quiz__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./handlers/is-quiz */ "./src/background/handlers/is-quiz.ts");
/* harmony import */ var _handlers_parse_questions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./handlers/parse-questions */ "./src/background/handlers/parse-questions.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





function isBlockedUrl(url) {
    try {
        // Block chatgpt.* and chat.openai.* domains (and subdomains)
        return /^https?:\/\/(?:[^.]+\.)*(?:chatgpt|chat\.openai)(?:\.[^.]+)*(?:\/|$)/i.test(url);
    }
    catch (_a) {
        return false;
    }
}
function handleMessage(request, sender, sendResponse) {
    var _a, _b;
    // Forward visibility indicator messages to the same tab
    if (['ANSWERS_LOADING', 'ANSWERS_LOADED', 'ANSWERS_FAILED', 'QUESTION_APPLIED', 'RESET_QUESTION_STATES'].includes(request.action)) {
        if ((_a = sender.tab) === null || _a === void 0 ? void 0 : _a.id) {
            chrome.tabs.sendMessage(sender.tab.id, request).catch(() => {
                // Ignore errors if tab can't receive messages
            });
        }
    }
    switch (request.action) {
        case 'PING':
            sendResponse({
                success: true,
                data: {
                    installed: true
                }
            });
            return true;
        case 'OPEN_POPUP':
            if ((_b = sender.tab) === null || _b === void 0 ? void 0 : _b.id) {
                chrome.action.openPopup()
                    .then(() => {
                    sendResponse({ success: true, data: {} });
                })
                    .catch((error) => {
                    sendResponse({ success: false, error: error.message });
                });
            }
            return true;
        case 'AUTH':
            (0,_handlers_auth__WEBPACK_IMPORTED_MODULE_0__.handleAuthStateChange)({
                email: request.input.email,
                userId: request.input.userId,
                customerId: request.input.customerId,
                loggedInNew: request.input.loggedInNew
            });
            sendResponse({
                success: true,
                data: {
                    email: request.input.email,
                    userId: request.input.userId,
                    customerId: request.input.customerId,
                    loggedInNew: request.input.loggedInNew
                }
            });
            return true;
        case 'ANSWER':
            (0,_handlers_answer__WEBPACK_IMPORTED_MODULE_1__.handleAnswerQuestion)({
                html: request.input.html,
                quizSummary: request.input.quizSummary,
                fingerPrint: request.input.fingerPrint,
                sendResponse
            });
            return true;
        case 'IS_QUIZ':
            (0,_handlers_is_quiz__WEBPACK_IMPORTED_MODULE_3__.handleIsQuiz)({
                html: request.input.html,
                fingerPrint: request.input.fingerPrint,
                provider: request.input.provider,
                sendResponse
            });
            return true;
        case 'PARSE_QUESTIONS':
            (0,_handlers_parse_questions__WEBPACK_IMPORTED_MODULE_4__.handleParseQuestions)({
                html: request.input.html,
                fingerPrint: request.input.fingerPrint,
                provider: request.input.provider,
                sendResponse
            });
            return true;
        case 'EMAIL':
            getUserEmail().then(email => {
                sendResponse({
                    success: true,
                    data: {
                        email
                    }
                });
            }).catch(error => {
                sendResponse({
                    success: false,
                    error: 'Failed to retrieve email'
                });
            });
            return true;
        case 'GET_SHORTCUTS':
            chrome.commands.getAll((commands) => {
                const manualTriggerCommand = commands.find(cmd => cmd.name === 'manual_trigger');
                const toggleVisibilityCommand = commands.find(cmd => cmd.name === 'toggle_visibility');
                sendResponse({
                    success: true,
                    data: {
                        manualTriggerShortcut: (manualTriggerCommand === null || manualTriggerCommand === void 0 ? void 0 : manualTriggerCommand.shortcut) || null,
                        toggleVisibilityShortcut: (toggleVisibilityCommand === null || toggleVisibilityCommand === void 0 ? void 0 : toggleVisibilityCommand.shortcut) || null
                    }
                });
            });
            return true;
        case 'OPEN_SHORTCUTS':
            chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
            sendResponse({ success: true, data: {} });
            return true;
        default:
            return false;
    }
}
chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') {
        chrome.storage.local.set({ completedNew: true });
        chrome.tabs.create({ url: 'https://cheatmate.io/onboarding' });
    }
});
function getUserEmail() {
    return new Promise((resolve) => {
        try {
            chrome.identity.getProfileUserInfo((userInfo) => {
                resolve(userInfo.email || null);
            });
        }
        catch (error) {
            resolve(null);
        }
    });
}
chrome.runtime.onMessage.addListener(handleMessage);
chrome.runtime.onMessageExternal.addListener(handleMessage);
chrome.commands.onCommand.addListener((command) => {
    if (command === 'manual_trigger') {
        // Manually trigger injection on the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            if (tab)
                triggerInjection(tab, 'manual_trigger');
        });
    }
    else if (command === 'toggle_visibility') {
        // Cycle through all three modes: Normal → Sneaky → Invisible → Normal
        chrome.storage.local.get(['visibility'], (result) => {
            const currentVisibility = result.visibility || 'Normal';
            let newVisibility;
            switch (currentVisibility) {
                case 'Normal':
                    newVisibility = 'Sneaky';
                    break;
                case 'Sneaky':
                    newVisibility = 'Invisible';
                    break;
                case 'Invisible':
                    newVisibility = 'Normal';
                    break;
                default:
                    newVisibility = 'Sneaky';
            }
            chrome.storage.local.set({ visibility: newVisibility });
        });
    }
});
function triggerInjection(tab, mode) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if study buddy is enabled first
        chrome.storage.local.get(['enabled'], (result) => {
            var _a;
            const isEnabled = (_a = result.enabled) !== null && _a !== void 0 ? _a : true;
            if (!isEnabled)
                return;
            // Check completedNew flag
            chrome.storage.local.get(['completedNew'], (result) => {
                if (result.completedNew !== true) {
                    chrome.storage.local.set({ completedNew: true });
                    chrome.tabs.create({ url: 'https://cheatmate.io/existing' });
                }
            });
            if (!tab.id || !tab.url)
                return;
            // Always inject on any page
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: [_constants_script__WEBPACK_IMPORTED_MODULE_2__.INJECT_FILE]
            }).then(() => {
                chrome.tabs.sendMessage(tab.id, {
                    action: 'TRIGGER_FORM_ACTION',
                    mode
                });
            });
        });
    });
}
chrome.action.onClicked.addListener((tab) => __awaiter(void 0, void 0, void 0, function* () {
    // Extension icon click triggers manual mode
    triggerInjection(tab, 'manual_trigger');
}));

})();


//# sourceMappingURL=background.js.map