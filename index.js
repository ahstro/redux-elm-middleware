'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reducer = exports.createElmReducer = exports.ELM = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _camelcase = require('camelcase');

var _camelcase2 = _interopRequireDefault(_camelcase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var ELM = exports.ELM = '@@elm';

var createElmMiddleware = function createElmMiddleware(elm) {
  var elmMiddleware = function elmMiddleware(_ref) {
    var dispatch = _ref.dispatch;
    return function (next) {
      return function (action) {
        var camelCaseType = (0, _camelcase2.default)(action.type);
        if (elm.ports && elm.ports[camelCaseType]) {
          elm.ports[camelCaseType].send(action.payload || null);
        }
        next(action);
      };
    };
  };
  var run = function run(store) {
    if (elm && elm.ports && elm.ports.elmToRedux) {
      elm.ports.elmToRedux.subscribe(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            action = _ref3[0],
            payload = _ref3[1];

        var _action$split = action.split(' '),
            _action$split2 = _toArray(_action$split),
            actionType = _action$split2[0],
            rest = _action$split2.slice(1);

        store.dispatch({
          type: '@@elm/' + actionType,
          payload: payload
        });
      });
    }
  };

  return { elmMiddleware: elmMiddleware, run: run };
};

exports.default = createElmMiddleware;
var createElmReducer = exports.createElmReducer = function createElmReducer(init) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : init;
    var action = arguments[1];

    var _action$type$split = action.type.split('/'),
        _action$type$split2 = _slicedToArray(_action$type$split, 2),
        elmAction = _action$type$split2[0],
        type = _action$type$split2[1];

    if (elmAction === ELM) {
      return action.payload;
    }

    return state;
  };
};

var reducer = exports.reducer = createElmReducer({});