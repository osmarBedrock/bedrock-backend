"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FailureReason = exports.Animation = exports.PurpleType = exports.SessionTargetType = exports.ResourceType = exports.Protocol = exports.Name = exports.ScoreDisplayMode = exports.SubItemsType = exports.Rity = exports.ValueTypeEnum = exports.DebugDataType = void 0;
var DebugDataType;
(function (DebugDataType) {
    DebugDataType["Debugdata"] = "debugdata";
    DebugDataType["Screenshot"] = "screenshot";
    DebugDataType["Table"] = "table";
    DebugDataType["TreemapData"] = "treemap-data";
})(DebugDataType || (exports.DebugDataType = DebugDataType = {}));
var ValueTypeEnum;
(function (ValueTypeEnum) {
    ValueTypeEnum["Bytes"] = "bytes";
    ValueTypeEnum["Code"] = "code";
    ValueTypeEnum["MS"] = "ms";
    ValueTypeEnum["Node"] = "node";
    ValueTypeEnum["Numeric"] = "numeric";
    ValueTypeEnum["SourceLocation"] = "source-location";
    ValueTypeEnum["Text"] = "text";
    ValueTypeEnum["TimespanMS"] = "timespanMs";
    ValueTypeEnum["URL"] = "url";
})(ValueTypeEnum || (exports.ValueTypeEnum = ValueTypeEnum = {}));
var Rity;
(function (Rity) {
    Rity["High"] = "High";
    Rity["Low"] = "Low";
    Rity["Medium"] = "Medium";
    Rity["VeryHigh"] = "VeryHigh";
    Rity["VeryLow"] = "VeryLow";
})(Rity || (exports.Rity = Rity = {}));
var SubItemsType;
(function (SubItemsType) {
    SubItemsType["Subitems"] = "subitems";
})(SubItemsType || (exports.SubItemsType = SubItemsType = {}));
var ScoreDisplayMode;
(function (ScoreDisplayMode) {
    ScoreDisplayMode["Binary"] = "binary";
    ScoreDisplayMode["Informative"] = "informative";
    ScoreDisplayMode["Manual"] = "manual";
    ScoreDisplayMode["MetricSavings"] = "metricSavings";
    ScoreDisplayMode["NotApplicable"] = "notApplicable";
    ScoreDisplayMode["Numeric"] = "numeric";
})(ScoreDisplayMode || (exports.ScoreDisplayMode = ScoreDisplayMode = {}));
var Name;
(function (Name) {
    Name["GoogleAnalytics"] = "Google Analytics";
    Name["GoogleFonts"] = "Google Fonts";
    Name["GoogleTagManager"] = "Google Tag Manager";
    Name["PrestigesurgeryCOM"] = "prestigesurgery.com";
})(Name || (exports.Name = Name = {}));
var Protocol;
(function (Protocol) {
    Protocol["Blob"] = "blob";
    Protocol["H2"] = "h2";
})(Protocol || (exports.Protocol = Protocol = {}));
var ResourceType;
(function (ResourceType) {
    ResourceType["Document"] = "Document";
    ResourceType["Fetch"] = "Fetch";
    ResourceType["Font"] = "Font";
    ResourceType["Image"] = "Image";
    ResourceType["Script"] = "Script";
    ResourceType["Stylesheet"] = "Stylesheet";
})(ResourceType || (exports.ResourceType = ResourceType = {}));
var SessionTargetType;
(function (SessionTargetType) {
    SessionTargetType["Page"] = "page";
    SessionTargetType["Worker"] = "worker";
})(SessionTargetType || (exports.SessionTargetType = SessionTargetType = {}));
var PurpleType;
(function (PurpleType) {
    PurpleType["Filmstrip"] = "filmstrip";
    PurpleType["Opportunity"] = "opportunity";
    PurpleType["Table"] = "table";
})(PurpleType || (exports.PurpleType = PurpleType = {}));
var Animation;
(function (Animation) {
    Animation["Visibility"] = "visibility";
})(Animation || (exports.Animation = Animation = {}));
var FailureReason;
(function (FailureReason) {
    FailureReason["UnsupportedCSSPropertyVisibility"] = "Unsupported CSS Property: visibility";
})(FailureReason || (exports.FailureReason = FailureReason = {}));
