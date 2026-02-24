/******/ var __webpack_modules__ = ({

/***/ "./src/constants/dom.ts":
/*!******************************!*\
  !*** ./src/constants/dom.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseFilterRules: () => (/* binding */ BaseFilterRules),
/* harmony export */   PROVIDER_RULES: () => (/* binding */ PROVIDER_RULES)
/* harmony export */ });
const BaseFilterRules = [
    {
        element: "SCRIPT",
        attribute: "*",
        value: "*"
    },
    {
        element: "STYLE",
        attribute: "*",
        value: "*"
    },
    {
        element: "NOSCRIPT",
        attribute: "*",
        value: "*"
    },
    {
        element: "META",
        attribute: "*",
        value: "*"
    },
    {
        element: "HEADER",
        attribute: "*",
        value: "*"
    },
    {
        element: "SVG",
        attribute: "*",
        value: "*"
    },
];
const PROVIDER_RULES = {
    googleForms: {
        filterRules: BaseFilterRules,
        keepAttrRules: [
            {
                element: "*",
                attribute: "role",
                value: "*"
            },
            {
                element: "*",
                attribute: "aria-expanded",
                value: "false"
            },
        ]
    },
    d2l: {
        filterRules: BaseFilterRules,
        keepAttrRules: [
            {
                element: "*",
                attribute: "type",
                value: "*"
            },
        ]
    },
    canvas: {
        filterRules: BaseFilterRules,
        keepAttrRules: []
    }
};


/***/ }),

/***/ "./src/scripts/answer.ts":
/*!*******************************!*\
  !*** ./src/scripts/answer.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyAnswers: () => (/* binding */ applyAnswers)
/* harmony export */ });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom */ "./src/scripts/dom.ts");

function applyAnswers({ output, provider }) {
    if (output.answer.type === 'single_select') {
        answerSingleSelect({ answer: output.answer, provider });
    }
    else if (output.answer.type === 'multi_select') {
        answerMultiSelect({ answer: output.answer, provider });
    }
    else if (output.answer.type === 'single_dropdown') {
        answerSingleDropDown({ answer: output.answer, provider });
    }
    else if (output.answer.type === 'single_text' && output.question.type === 'single_text') {
        answerSingleText({ answer: output.answer, question: output.question, provider });
    }
    else if (output.answer.type === 'fill_in_the_blank_text') {
        answerFillInTheBlankText({ answer: output.answer, provider });
    }
    else if (output.answer.type === 'fill_in_the_blank_dropdown' ||
        output.answer.type === 'multi_dropdown_key' ||
        output.answer.type === 'multi_dropdown_no_key') {
        answerMultiDropDown({ answer: output.answer, provider });
    }
}
function answerSingleSelect({ answer, provider }) {
    console.log("answer: ", answer.type);
    clickSingleSelect({ answer: answer.output.correctAnswer, provider });
}
function answerMultiSelect({ answer, provider }) {
    console.log("answer: ", answer.type);
    answer.output.correctAnswers.forEach((ans) => {
        clickSingleSelect({ answer: ans, provider });
    });
}
function answerSingleDropDown({ answer, provider }) {
    console.log("answer: ", answer.type);
    selectDropdown({
        optionCmId: String(answer.output.dropdown.correctAnswer.cmId),
        dropDownCmId: String(answer.output.dropdown.cmId),
        provider
    });
}
function answerSingleText({ answer, question, provider }) {
    console.log("answer: ", answer.type);
    fillFreeResponse({
        cmId: String(question.question.input.cmId),
        text: answer.output.correctAnswer
    });
}
function answerFillInTheBlankText({ answer, provider }) {
    console.log("answer: ", answer.type);
    answer.output.correctAnswers.map((answer) => {
        console.log("answering: ", answer.answer);
        fillFreeResponse({
            cmId: String(answer.cmId),
            text: answer.answer
        });
    });
}
function answerMultiDropDown({ answer, provider }) {
    console.log("answer: ", answer.type);
    answer.output.dropdowns.map((dropdown) => {
        selectDropdown({
            optionCmId: String(dropdown.correctAnswer.cmId),
            dropDownCmId: String(dropdown.cmId),
            provider
        });
    });
}
function clickSingleSelect({ answer, provider }) {
    const el = (0,_dom__WEBPACK_IMPORTED_MODULE_0__.searchDocumentForElements)({ cmId: String(answer.cmId) })[0];
    if (!el) {
        console.log("[Error]: Unable to find html element for answer: ", answer.text);
        return;
    }
    simulateClick({ el, provider });
}
function simulateClick({ el, provider }) {
    el.click();
}
function fillFreeResponse({ cmId, text }) {
    const el = (0,_dom__WEBPACK_IMPORTED_MODULE_0__.searchDocumentForElements)({ cmId })[0];
    if (!el) {
        console.warn(`[Error]: Unable to find element for answer: ${text}`);
        return;
    }
    const tag = el.tagName.toUpperCase();
    const isTextField = tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        typeof el.value === 'string';
    if (isTextField) {
        const inputEl = el;
        inputEl.value = text;
        inputEl.dispatchEvent(new InputEvent('input', { bubbles: true }));
        inputEl.dispatchEvent(new Event('change', { bubbles: true }));
        inputEl.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    }
    else {
        el.textContent = text;
        el.dispatchEvent(new Event('input', { bubbles: true }));
    }
}
function selectDropdown({ optionCmId, dropDownCmId, provider }) {
    if (provider === 'd2l' || provider === 'canvas') {
        selectNativeDropdown({ dropDownCmId, optionCmId });
    }
    else {
        selectCustomDropdown({ dropDownCmId, optionCmId, provider });
    }
}
function selectCustomDropdown({ optionCmId, dropDownCmId, provider }) {
    console.log("selecting custom dropdown: ", dropDownCmId);
    const dropDownMatches = (0,_dom__WEBPACK_IMPORTED_MODULE_0__.searchDocumentForElements)({ cmId: dropDownCmId });
    if (dropDownMatches.length === 0) {
        console.error(`No elements found with cm-id="${dropDownCmId}"`);
        return;
    }
    console.log("dropdown matches: ", dropDownMatches);
    const close = () => setTimeout(() => document.body.click(), 50);
    if (dropDownMatches.length === 1) {
        simulateClick({ el: dropDownMatches[0], provider });
        setTimeout(() => {
            const optionMatches = (0,_dom__WEBPACK_IMPORTED_MODULE_0__.searchDocumentForElements)({ cmId: optionCmId });
            simulateClick({ el: optionMatches.pop(), provider });
            close();
        }, 500);
    }
    else {
        simulateClick({ el: dropDownMatches.pop(), provider });
        close();
    }
}
function selectNativeDropdown({ dropDownCmId, optionCmId }) {
    console.log("selecting native dropdown: ", dropDownCmId);
    const selEls = (0,_dom__WEBPACK_IMPORTED_MODULE_0__.searchDocumentForElements)({ cmId: dropDownCmId });
    const sel = selEls[0];
    if (!sel || sel.tagName.toLowerCase() !== 'select') {
        console.error(`No <select> found with cm-id="${dropDownCmId}"`);
        return;
    }
    const optEls = (0,_dom__WEBPACK_IMPORTED_MODULE_0__.searchDocumentForElements)({ cmId: optionCmId });
    const opt = optEls.find(e => e.value != null);
    if (!opt) {
        console.error(`No <option> found with cm-id="${optionCmId}"`);
        return;
    }
    sel.value = opt.value;
    sel.dispatchEvent(new Event('input', { bubbles: true }));
    sel.dispatchEvent(new Event('change', { bubbles: true }));
}


/***/ }),

/***/ "./src/scripts/background.ts":
/*!***********************************!*\
  !*** ./src/scripts/background.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   requestAnswerQuestion: () => (/* binding */ requestAnswerQuestion),
/* harmony export */   requestIsQuiz: () => (/* binding */ requestIsQuiz)
/* harmony export */ });
function requestAnswerQuestion(input) {
    const message = { action: 'ANSWER', input };
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, (res) => {
            if (chrome.runtime.lastError)
                reject(chrome.runtime.lastError);
            else
                resolve(res);
        });
    });
}
function requestIsQuiz(input) {
    const message = { action: 'IS_QUIZ', input };
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, (res) => {
            if (chrome.runtime.lastError)
                reject(chrome.runtime.lastError);
            else
                resolve(res);
        });
    });
}


/***/ }),

/***/ "./src/scripts/dom.ts":
/*!****************************!*\
  !*** ./src/scripts/dom.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   annotateHtml: () => (/* binding */ annotateHtml),
/* harmony export */   findElementsByCmId: () => (/* binding */ findElementsByCmId),
/* harmony export */   findParentElements: () => (/* binding */ findParentElements),
/* harmony export */   getHtml: () => (/* binding */ getHtml),
/* harmony export */   searchDocumentForElements: () => (/* binding */ searchDocumentForElements)
/* harmony export */ });
/**
 * Annotates every element in the document with a unique 'cm-id' attribute,
 * starting from <body> instead of <html>.
 */
function annotateHtml() {
    let idCounter = 1;
    function annotate(el) {
        el.setAttribute('cm-id', String(idCounter++));
        // Shadow DOM
        const sr = el.shadowRoot;
        if (sr) {
            sr.childNodes.forEach(n => {
                if (n.nodeType === Node.ELEMENT_NODE)
                    annotate(n);
            });
        }
        // Same‑origin iframe
        if (el.tagName === 'IFRAME') {
            try {
                const doc = el.contentDocument;
                if (doc === null || doc === void 0 ? void 0 : doc.body) {
                    doc.body.childNodes.forEach(n => {
                        if (n.nodeType === Node.ELEMENT_NODE)
                            annotate(n);
                    });
                }
            }
            catch (_a) {
                // cross‑origin → skip
            }
        }
        // Light‑DOM children
        el.childNodes.forEach(n => {
            if (n.nodeType === Node.ELEMENT_NODE)
                annotate(n);
        });
    }
    if (document.body) {
        annotate(document.body);
    }
}
function getHtml({ startingCmId, filterRules = [], keepAttrRules = [] }) {
    const root = startingCmId
        ? searchDocumentForElements({ cmId: startingCmId })[0]
        : document.body;
    if (!root)
        return '';
    function cloneAndClean(node) {
        // 1) Text nodes: drop empty, else clone
        if (node.nodeType === Node.TEXT_NODE) {
            const txt = node.nodeValue || '';
            if (txt.trim() === '')
                return null;
            return document.createTextNode(txt);
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
            const orig = node;
            const tag = orig.tagName.toUpperCase();
            // 2) Apply filterRules: if any rule matches, drop this element
            const shouldFilter = filterRules.some(rule => {
                const elemMatch = rule.element === '*' || rule.element.toUpperCase() === tag;
                if (!elemMatch)
                    return false;
                // attribute wildcard → either value wildcard (always drop) or specific value match
                if (rule.attribute === '*') {
                    return rule.value === '*' ||
                        Array.from(orig.attributes).some(a => a.value === rule.value);
                }
                // specific attribute must exist
                if (!orig.hasAttribute(rule.attribute))
                    return false;
                return rule.value === '*' || orig.getAttribute(rule.attribute) === rule.value;
            });
            if (shouldFilter) {
                return null;
            }
            // 3) Clone element node
            const clean = document.createElement(orig.tagName.toLowerCase());
            // 4) Copy attributes: always keep "cm-id", plus those matching keepAttrRules
            Array.from(orig.attributes).forEach(attr => {
                const name = attr.name;
                const val = attr.value;
                // always preserve cm-id
                if (name === 'cm-id') {
                    clean.setAttribute(name, val);
                    return;
                }
                // check keep rules
                const keep = keepAttrRules.some(rule => {
                    const elemMatch = rule.element === '*' || rule.element.toUpperCase() === tag;
                    const attrMatch = rule.attribute === '*' || rule.attribute === name;
                    const valMatch = rule.value === '*' || val === rule.value;
                    return elemMatch && attrMatch && valMatch;
                });
                if (keep) {
                    clean.setAttribute(name, val);
                }
            });
            // 5) Handle Shadow DOM
            const sr = orig.shadowRoot;
            if (sr) {
                const wrapper = document.createElement('shadow-root');
                sr.childNodes.forEach(c => {
                    const cc = cloneAndClean(c);
                    if (cc)
                        wrapper.appendChild(cc);
                });
                clean.appendChild(wrapper);
            }
            // 6) Handle same‑origin iframe
            if (tag === 'IFRAME') {
                try {
                    const doc = orig.contentDocument;
                    if (doc === null || doc === void 0 ? void 0 : doc.body) {
                        const wrapper = document.createElement('iframe-content');
                        doc.body.childNodes.forEach(c => {
                            const cc = cloneAndClean(c);
                            if (cc)
                                wrapper.appendChild(cc);
                        });
                        clean.appendChild(wrapper);
                    }
                }
                catch (_a) {
                    // cross‑origin → skip
                }
            }
            // 7) Recurse into children
            orig.childNodes.forEach(c => {
                const cc = cloneAndClean(c);
                if (cc)
                    clean.appendChild(cc);
            });
            // 8) Collapse single‑child DIV wrappers
            if (tag === 'DIV' &&
                clean.childNodes.length === 1 &&
                clean.firstChild.nodeType === Node.ELEMENT_NODE &&
                clean.firstChild.tagName.toUpperCase() === 'DIV') {
                return clean.firstChild;
            }
            return clean;
        }
        // other node types → drop
        return null;
    }
    const cleaned = cloneAndClean(root);
    return cleaned ? cleaned.outerHTML : '';
}
function findElementsByCmId({ node, cmId }) {
    const results = [];
    if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node;
        // match on this element
        if (el.getAttribute('cm-id') === cmId) {
            results.push(el);
        }
        // Shadow DOM
        const sr = el.shadowRoot;
        if (sr) {
            for (const child of Array.from(sr.childNodes)) {
                results.push(...findElementsByCmId({ node: child, cmId }));
            }
        }
        // Same-origin iframe
        if (el.tagName === 'IFRAME') {
            try {
                const doc = el.contentDocument;
                if (doc === null || doc === void 0 ? void 0 : doc.body) {
                    for (const child of Array.from(doc.body.childNodes)) {
                        results.push(...findElementsByCmId({ node: child, cmId }));
                    }
                }
            }
            catch (_a) {
                // cross-origin → skip
            }
        }
        // Light-DOM children
        for (const child of Array.from(el.childNodes)) {
            results.push(...findElementsByCmId({ node: child, cmId }));
        }
    }
    return results;
}
function searchDocumentForElements({ cmId }) {
    return findElementsByCmId({ node: document.body, cmId });
}
function findParentElements({ html, questionCmIds }) {
    const root = { tagName: '__root__', children: [] };
    const stack = [root];
    const idToNode = new Map();
    // list of void elements that never have closing tags
    const voidTags = new Set([
        'area', 'base', 'br', 'col', 'embed', 'hr', 'img',
        'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
    ]);
    // 1) Build tree
    const tagRegex = /<\s*(\/)?\s*([^\s>\/]+)([^>]*)>/g;
    let match;
    while ((match = tagRegex.exec(html))) {
        const [, closingSlash, rawTagName, attrText] = match;
        const tagName = rawTagName.toLowerCase();
        const isClosing = Boolean(closingSlash);
        const isSelfClosing = !isClosing
            && (/\/\s*$/.test(attrText) || voidTags.has(tagName));
        if (!isClosing) {
            // opening or self-closing tag → create a new node
            const node = { tagName, children: [] };
            // extract cm-id if present
            const cmMatch = /cm-id\s*=\s*["']?([\w-]+)["']?/.exec(attrText);
            if (cmMatch) {
                node.cmId = cmMatch[1];
                idToNode.set(node.cmId, node);
            }
            // attach to current parent
            const parent = stack[stack.length - 1];
            node.parent = parent;
            parent.children.push(node);
            // only push non-self-closing nodes
            if (!isSelfClosing) {
                stack.push(node);
            }
        }
        if (isClosing) {
            // pop the matching opening tag by name
            for (let i = stack.length - 1; i >= 0; i--) {
                if (stack[i].tagName === tagName) {
                    stack.splice(i, 1);
                    break;
                }
            }
        }
        // no pop for self-closing, since we never pushed them
    }
    // helper: is `desc` somewhere under `ancestor`?
    function isDescendant(desc, ancestor) {
        let cur = desc;
        while (cur) {
            if (cur === ancestor)
                return true;
            cur = cur.parent;
        }
        return false;
    }
    // 2) For each question, climb up as far as it still contains only that one Q
    const mapping = {};
    for (const qId of questionCmIds) {
        const start = idToNode.get(qId);
        if (!start)
            continue;
        let candidate = start;
        let current = start;
        while (current.parent) {
            const parent = current.parent;
            // count how many questions would live under this parent
            let count = 0;
            for (const otherQ of questionCmIds) {
                const node = idToNode.get(otherQ);
                if (node && isDescendant(node, parent)) {
                    count++;
                }
            }
            if (count === 1) {
                candidate = parent;
                current = parent;
            }
            else {
                break;
            }
        }
        if (candidate.cmId) {
            mapping[qId] = candidate.cmId;
        }
    }
    return mapping;
}


/***/ }),

/***/ "./src/scripts/interactions.ts":
/*!*************************************!*\
  !*** ./src/scripts/interactions.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setupInteraction: () => (/* binding */ setupInteraction)
/* harmony export */ });
/* harmony import */ var _background__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./background */ "./src/scripts/background.ts");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom */ "./src/scripts/dom.ts");
/* harmony import */ var _answer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./answer */ "./src/scripts/answer.ts");
/* harmony import */ var _constants_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants/dom */ "./src/constants/dom.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




function setupInteraction(_a) {
    return __awaiter(this, arguments, void 0, function* ({ questionToParentMap, quizSummary = '', provider }) {
        const parentCmIds = Object.values(questionToParentMap);
        let completed = 0;
        const answersCache = {};
        const pendingAnswers = {};
        // 1) Start timer
        const start = performance.now();
        // 2) Launch all requests
        for (const parentCmId of parentCmIds) {
            const html = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.getHtml)(Object.assign({ startingCmId: parentCmId }, _constants_dom__WEBPACK_IMPORTED_MODULE_3__.PROVIDER_RULES[provider]));
            pendingAnswers[parentCmId] = (() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const resp = yield (0,_background__WEBPACK_IMPORTED_MODULE_0__.requestAnswerQuestion)({ html, quizSummary });
                    if (resp.success) {
                        answersCache[parentCmId] = resp.data;
                        console.log(`%c[AnswerAPI] Cached for cmid=${parentCmId}:`, 'color:green', resp.data);
                    }
                    else {
                        console.warn(`%c[AnswerAPI] Error for cmid=${parentCmId}:`, 'color:orange', resp.error);
                    }
                }
                catch (err) {
                    console.error(`%c[AnswerAPI] Messaging error for cmid=${parentCmId}:`, 'color:red', err);
                }
                finally {
                    completed++;
                    console.log(`%c[Progress] ${completed}/${parentCmIds.length} answers generated`, 'font-style:italic');
                }
            }))();
        }
        // 3) Wait for *all* to finish
        yield Promise.all(Object.values(pendingAnswers));
        // 4) Stop timer & log total
        const end = performance.now();
        console.log(`%c[AnswerAPI] Total time for ${parentCmIds.length} questions: ${((end - start) /
            1000).toFixed(2)}s`, 'color:blue; font-weight:bold');
        // Only listen for double-clicks, no other event logging
        function attachMouseListeners(doc) {
            doc.addEventListener('dblclick', evt => {
                var _a;
                let el = evt.target;
                let matched = false;
                while (el && el !== doc.documentElement) {
                    const cmid = el.getAttribute('cm-id');
                    if (cmid && parentCmIds.includes(cmid)) {
                        matched = true;
                        console.log(`✔ Found cm-id=${cmid} on`, el);
                        const qCmId = Object.keys(questionToParentMap).find(key => questionToParentMap[key] === cmid);
                        const applyNow = () => {
                            const output = answersCache[cmid] || [];
                            if (output.answer.output) {
                                console.log(`→ Applying answer for question: `, output.question.question);
                                (0,_answer__WEBPACK_IMPORTED_MODULE_2__.applyAnswers)({ output, provider });
                            }
                            else {
                                console.warn(`→ No cached answers for cm-id=${cmid}`);
                            }
                        };
                        if (answersCache[cmid]) {
                            console.log('→ Cache hit, applying immediately');
                            applyNow();
                        }
                        else {
                            console.log('→ Cache miss, will apply after pending resolves');
                            (_a = pendingAnswers[cmid]) === null || _a === void 0 ? void 0 : _a.then(() => {
                                console.log('→ Pending resolved, applying now');
                                applyNow();
                            });
                        }
                        break;
                    }
                    el = el.parentElement;
                }
                if (!matched) {
                    console.log('✖ No matching cm-id in ancestor chain');
                }
                console.groupEnd();
            }, 
            /* useCapture */ false);
            // Recurse into same-origin iframes
            Array.from(doc.querySelectorAll('iframe')).forEach(iframe => {
                try {
                    const childDoc = iframe.contentDocument;
                    if (childDoc) {
                        attachMouseListeners(childDoc);
                    }
                }
                catch (_a) {
                    // cross-origin → skip
                }
            });
        }
        attachMouseListeners(document);
    });
}


/***/ }),

/***/ "./src/scripts/is-quiz.ts":
/*!********************************!*\
  !*** ./src/scripts/is-quiz.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkQuizPage: () => (/* binding */ checkQuizPage)
/* harmony export */ });
/* harmony import */ var _background__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./background */ "./src/scripts/background.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

function checkQuizPage(html) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield (0,_background__WEBPACK_IMPORTED_MODULE_0__.requestIsQuiz)({ html });
        console.log("res", res);
        if (!res.success) {
            console.log("error getting quiz status");
            return;
        }
        console.log("isQuiz: ", res.data.isQuiz);
        return res.data;
    });
}


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
/*!******************************!*\
  !*** ./src/providers/d2l.ts ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/dom */ "./src/constants/dom.ts");
/* harmony import */ var _scripts_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scripts/dom */ "./src/scripts/dom.ts");
/* harmony import */ var _scripts_interactions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scripts/interactions */ "./src/scripts/interactions.ts");
/* harmony import */ var _scripts_is_quiz__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../scripts/is-quiz */ "./src/scripts/is-quiz.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




function triggerFormAction() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('CheatMate: D2L triggered');
        (0,_scripts_dom__WEBPACK_IMPORTED_MODULE_1__.annotateHtml)();
        const html = (0,_scripts_dom__WEBPACK_IMPORTED_MODULE_1__.getHtml)(_constants_dom__WEBPACK_IMPORTED_MODULE_0__.PROVIDER_RULES.d2l);
        console.log("html", html);
        const quizCheck = yield (0,_scripts_is_quiz__WEBPACK_IMPORTED_MODULE_3__.checkQuizPage)(html);
        if (!(quizCheck === null || quizCheck === void 0 ? void 0 : quizCheck.isQuiz)) {
            console.log('Not a quiz');
            return;
        }
        console.log("questions: ", quizCheck.questions);
        const questionCmIds = quizCheck.questions.map((q) => q.cmId);
        const questionMap = (0,_scripts_dom__WEBPACK_IMPORTED_MODULE_1__.findParentElements)({ html, questionCmIds });
        console.log('Parent element cm-ids:', questionMap);
        void (0,_scripts_interactions__WEBPACK_IMPORTED_MODULE_2__.setupInteraction)({
            questionToParentMap: questionMap,
            quizSummary: quizCheck.quizSummary,
            provider: "d2l"
        });
    });
}
if (!window.__cheatMateHasRun) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (!window.__cheatMateHasRun) {
            console.log("hasn't run", window.__cheatMateHasRun);
            window.__cheatMateHasRun = true;
            if (request.action === 'TRIGGER_FORM_ACTION') {
                const run = () => triggerFormAction().catch(err => console.error('TriggerFormAction failed:', err));
                if (document.readyState === 'complete') {
                    console.log("run", window.__cheatMateHasRun);
                    run();
                }
                else {
                    window.addEventListener('load', run, { once: true });
                }
                sendResponse({ success: true });
            }
            return true;
        }
        else {
            console.log("has run", window.__cheatMateHasRun);
        }
    });
}

})();


//# sourceMappingURL=d2l.js.map