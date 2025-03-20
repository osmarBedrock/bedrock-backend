export type Range = "day" | "week" | "month" | "quarter";

export type AnalyticsConsult = "chartData" | "activeUsers" | "usersByCountry" | "sessions" | "queries";

export interface BuildBodyOptions {
    startDate: string;
    endDate: string;
    range: Range;
    metrics: string[];
    dimensions?: string[]; 
    keepEmptyRows?: boolean;
}
export interface ResponsePageSpeed {
    captchaResult:        string;
    kind:                 string;
    id:                   string;
    loadingExperience:    LoadingExperience;
    lighthouseResult:     LighthouseResult;
    analysisUTCTimestamp: Date;
}

export interface LighthouseResult {
    requestedUrl:       string;
    finalUrl:           string;
    mainDocumentUrl:    string;
    finalDisplayedUrl:  string;
    lighthouseVersion:  string;
    userAgent:          string;
    fetchTime:          Date;
    environment:        Environment;
    runWarnings:        any[];
    configSettings:     ConfigSettings;
    audits:             Audits;
    categories:         Categories;
    categoryGroups:     CategoryGroups;
    timing:             Timing;
    i18n:               I18N;
    stackPacks:         StackPack[];
    entities:           Entity[];
    fullPageScreenshot: FullPageScreenshot;
}

export interface Audits {
    "is-on-https":                      Accesskeys;
    "no-document-write":                Accesskeys;
    "meta-description":                 Accesskeys;
    "target-size":                      CumulativeLayoutShift;
    "image-redundant-alt":              Accesskeys;
    "font-size":                        Accesskeys;
    "table-fake-caption":               CumulativeLayoutShift;
    accesskeys:                         Accesskeys;
    "final-screenshot":                 Accesskeys;
    "duplicate-id-aria":                Accesskeys;
    "form-field-multiple-labels":       Accesskeys;
    "uses-responsive-images":           DOMSize;
    "legacy-javascript":                BootupTime;
    "http-status-code":                 Accesskeys;
    "largest-contentful-paint-element": CriticalRequestChains;
    "network-server-latency":           CriticalRequestChains;
    "video-caption":                    CumulativeLayoutShift;
    label:                              Accesskeys;
    "aria-valid-attr-value":            Accesskeys;
    "custom-controls-labels":           Accesskeys;
    "critical-request-chains":          CriticalRequestChains;
    "aria-command-name":                Accesskeys;
    "network-rtt":                      BootupTime;
    diagnostics:                        Accesskeys;
    "aria-conditional-attr":            Accesskeys;
    "total-byte-weight":                DOMSize;
    "layout-shifts":                    BootupTime;
    "total-blocking-time":              DOMSize;
    "use-landmarks":                    Accesskeys;
    "valid-source-maps":                Accesskeys;
    "empty-heading":                    Accesskeys;
    "offscreen-content-hidden":         BootupTime;
    "redirects-http":                   Accesskeys;
    "script-treemap-data":              Accesskeys;
    "is-crawlable":                     Accesskeys;
    "aria-required-attr":               Accesskeys;
    "aria-allowed-role":                Accesskeys;
    "frame-title":                      Accesskeys;
    dlitem:                             Accesskeys;
    "unsized-images":                   Accesskeys;
    canonical:                          Accesskeys;
    "link-in-text-block":               Accesskeys;
    "max-potential-fid":                CumulativeLayoutShift;
    "custom-controls-roles":            Accesskeys;
    "screenshot-thumbnails":            BootupTime;
    "offscreen-images":                 DuplicatedJavascript;
    charset:                            Accesskeys;
    "third-party-cookies":              BootupTime;
    "cumulative-layout-shift":          CumulativeLayoutShift;
    "object-alt":                       BootupTime;
    "table-duplicate-name":             CumulativeLayoutShift;
    "long-tasks":                       BootupTime;
    "largest-contentful-paint":         CriticalRequestChains;
    "input-image-alt":                  Accesskeys;
    "aria-treeitem-name":               Accesskeys;
    "aria-text":                        Accesskeys;
    "geolocation-on-start":             Accesskeys;
    "errors-in-console":                Accesskeys;
    "mainthread-work-breakdown":        CriticalRequestChains;
    "js-libraries":                     Accesskeys;
    "select-name":                      CumulativeLayoutShift;
    "aria-hidden-focus":                Accesskeys;
    "unminified-javascript":            CriticalRequestChains;
    "resource-summary":                 Accesskeys;
    "image-alt":                        Accesskeys;
    "focusable-controls":               Accesskeys;
    interactive:                        CriticalRequestChains;
    "aria-required-parent":             Accesskeys;
    "aria-hidden-body":                 Accesskeys;
    "aria-tooltip-name":                Accesskeys;
    "uses-text-compression":            DOMSize;
    "server-response-time":             CumulativeLayoutShift;
    viewport:                           Viewport;
    "crawlable-anchors":                Accesskeys;
    "definition-list":                  Accesskeys;
    "aria-meter-name":                  Accesskeys;
    metrics:                            CumulativeLayoutShift;
    "skip-link":                        CumulativeLayoutShift;
    "efficient-animated-content":       DuplicatedJavascript;
    "modern-image-formats":             DuplicatedJavascript;
    "prioritize-lcp-image":             BootupTime;
    "landmark-one-main":                Accesskeys;
    "focus-traps":                      Accesskeys;
    "uses-rel-preconnect":              UsesRelPreconnect;
    "image-aspect-ratio":               Accesskeys;
    "document-title":                   Accesskeys;
    "first-meaningful-paint":           Accesskeys;
    list:                               BootupTime;
    "non-composited-animations":        CumulativeLayoutShift;
    "robots-txt":                       CumulativeLayoutShift;
    "td-has-header":                    BootupTime;
    "main-thread-tasks":                Accesskeys;
    "html-xml-lang-mismatch":           Accesskeys;
    "th-has-data-cells":                BootupTime;
    "uses-passive-event-listeners":     Accesskeys;
    "visual-order-follows-dom":         BootupTime;
    "aria-prohibited-attr":             Accesskeys;
    "uses-long-cache-ttl":              DuplicatedJavascript;
    "notification-on-start":            CumulativeLayoutShift;
    "csp-xss":                          Accesskeys;
    "aria-dialog-name":                 Accesskeys;
    "link-name":                        Accesskeys;
    "lcp-lazy-loaded":                  Accesskeys;
    "aria-allowed-attr":                Accesskeys;
    redirects:                          CriticalRequestChains;
    deprecations:                       Accesskeys;
    "unused-javascript":                DuplicatedJavascript;
    "third-party-facades":              BootupTime;
    "identical-links-same-purpose":     Accesskeys;
    "aria-input-field-name":            Accesskeys;
    "td-headers-attr":                  BootupTime;
    tabindex:                           CumulativeLayoutShift;
    "first-contentful-paint":           BootupTime;
    "speed-index":                      DuplicatedJavascript;
    "aria-progressbar-name":            Accesskeys;
    "font-display":                     Accesskeys;
    "uses-optimized-images":            BootupTime;
    "duplicated-javascript":            DuplicatedJavascript;
    bypass:                             Accesskeys;
    doctype:                            Accesskeys;
    "aria-deprecated-role":             Accesskeys;
    "third-party-summary":              BootupTime;
    "image-size-responsive":            Accesskeys;
    "managed-focus":                    Accesskeys;
    "link-text":                        BootupTime;
    "button-name":                      Accesskeys;
    "valid-lang":                       Accesskeys;
    "dom-size":                         DOMSize;
    hreflang:                           Accesskeys;
    "interactive-element-affordance":   Accesskeys;
    "render-blocking-resources":        CriticalRequestChains;
    "inspector-issues":                 Accesskeys;
    "bootup-time":                      BootupTime;
    "aria-roles":                       Accesskeys;
    "html-has-lang":                    Accesskeys;
    "paste-preventing-inputs":          BootupTime;
    "heading-order":                    Accesskeys;
    "aria-toggle-field-name":           Accesskeys;
    "structured-data":                  CumulativeLayoutShift;
    "network-requests":                 BootupTime;
    "aria-valid-attr":                  Accesskeys;
    "unminified-css":                   CriticalRequestChains;
    "html-lang-valid":                  Accesskeys;
    "meta-viewport":                    Accesskeys;
    "label-content-name-mismatch":      Accesskeys;
    "input-button-name":                Accesskeys;
    "user-timings":                     Accesskeys;
    "logical-tab-order":                BootupTime;
    "color-contrast":                   Accesskeys;
    "aria-required-children":           Accesskeys;
    "meta-refresh":                     Accesskeys;
    listitem:                           BootupTime;
    "unused-css-rules":                 CriticalRequestChains;
}

export interface Accesskeys {
    id:               string;
    title:            string;
    description:      string;
    score:            number | null;
    scoreDisplayMode: ScoreDisplayMode;
    details?:         AccesskeysDetails;
    warnings?:        any[];
    metricSavings?:   AccesskeysMetricSavings;
}

export interface AccesskeysDetails {
    items?:     PurpleItem[];
    headings?:  Heading[];
    type:       DebugDataType;
    debugData?: PurpleDebugData;
    timestamp?: number;
    timing?:    number;
    data?:      string;
    nodes?:     NodeElement[];
}

export interface PurpleDebugData {
    tags?:   string[];
    impact?: string;
    type:    DebugDataType;
    stacks?: Stack[];
}

export interface Stack {
    version?: string;
    id:       string;
}

export enum DebugDataType {
    Debugdata = "debugdata",
    Screenshot = "screenshot",
    Table = "table",
    TreemapData = "treemap-data",
}

export interface Heading {
    label?:           string;
    valueType:        ValueTypeEnum;
    key:              null | string;
    granularity?:     number;
    subItemsHeading?: SubItemsHeading;
    displayUnit?:     string;
}

export interface SubItemsHeading {
    key:        string;
    valueType?: ValueTypeEnum;
}

export enum ValueTypeEnum {
    Bytes = "bytes",
    Code = "code",
    MS = "ms",
    Node = "node",
    Numeric = "numeric",
    SourceLocation = "source-location",
    Text = "text",
    TimespanMS = "timespanMs",
    URL = "url",
}

export interface PurpleItem {
    subItems?:                 PurpleSubItems;
    node?:                     RelatedNodeClass;
    directive?:                string;
    severity?:                 Rity;
    description?:              string;
    numRequests?:              number;
    numFonts?:                 number;
    mainDocumentTransferSize?: number;
    maxRtt?:                   number;
    numStylesheets?:           number;
    numTasksOver10ms?:         number;
    numTasksOver25ms?:         number;
    numTasksOver50ms?:         number;
    maxServerLatency?:         number;
    totalTaskTime?:            number;
    numTasksOver100ms?:        number;
    throughput?:               number;
    numTasksOver500ms?:        number;
    numScripts?:               number;
    numTasks?:                 number;
    totalByteWeight?:          number;
    rtt?:                      number;
    sourceLocation?:           Location;
    source?:                   string;
    url?:                      string;
    wastedMs?:                 number;
    version?:                  string;
    npm?:                      string;
    name?:                     string;
    startTime?:                number;
    duration?:                 number;
    requestCount?:             number;
    label?:                    string;
    transferSize?:             number;
    resourceType?:             string;
    sourceMapUrl?:             string;
    scriptUrl?:                string;
}

export interface RelatedNodeClass {
    lhId:         string;
    nodeLabel:    string;
    snippet:      string;
    selector:     string;
    explanation?: string;
    type:         ValueTypeEnum;
    boundingRect: NodeValue;
    path:         string;
}

export interface NodeValue {
    left:   number;
    width:  number;
    right:  number;
    bottom: number;
    height: number;
    top:    number;
    id?:    string;
}

export enum Rity {
    High = "High",
    Low = "Low",
    Medium = "Medium",
    VeryHigh = "VeryHigh",
    VeryLow = "VeryLow",
}

export interface Location {
    line:        number;
    url:         string;
    column:      number;
    urlProvider: string;
    type:        ValueTypeEnum;
}

export interface PurpleSubItems {
    items: FluffyItem[];
    type:  SubItemsType;
}

export interface FluffyItem {
    relatedNode?: RelatedNodeClass;
    error?:       string;
}

export enum SubItemsType {
    Subitems = "subitems",
}

export interface NodeElement {
    children?:     NodeElement[];
    unusedBytes:   number;
    name:          string;
    resourceBytes: number;
}

export interface AccesskeysMetricSavings {
    LCP?: number;
    CLS?: number;
}

export enum ScoreDisplayMode {
    Binary = "binary",
    Informative = "informative",
    Manual = "manual",
    MetricSavings = "metricSavings",
    NotApplicable = "notApplicable",
    Numeric = "numeric",
}

export interface BootupTime {
    id:               string;
    title:            string;
    description:      string;
    score:            number | null;
    scoreDisplayMode: ScoreDisplayMode;
    displayValue?:    string;
    metricSavings?:   BootupTimeMetricSavings;
    details?:         BootupTimeDetails;
    numericValue?:    number;
    numericUnit?:     string;
    warnings?:        any[];
}

export interface BootupTimeDetails {
    sortedBy?:            string[];
    headings?:            Heading[];
    items:                TentacledItem[];
    summary?:             PurpleSummary;
    type:                 PurpleType;
    overallSavingsBytes?: number;
    overallSavingsMs?:    number;
    debugData?:           FluffyDebugData;
    skipSumming?:         string[];
    scale?:               number;
    isEntityGrouped?:     boolean;
}

export interface FluffyDebugData {
    metricSavings?:      DebugDataMetricSavings;
    type:                DebugDataType;
    urls?:               string[];
    tasks?:              Task[];
    networkStartTimeTs?: number;
    pathLength?:         number;
    initiatorPath?:      InitiatorPath[];
}

export interface InitiatorPath {
    initiatorType: string;
    url:           string;
}

export interface DebugDataMetricSavings {
    LCP: number;
    FCP: number;
}

export interface Task {
    duration:              number;
    scriptEvaluation:      number;
    urlIndex:              number;
    startTime:             number;
    other:                 number;
    paintCompositeRender?: number;
    styleLayout?:          number;
    parseHTML?:            number;
}

export interface TentacledItem {
    scripting?:                 number;
    total?:                     number;
    scriptParseCompile?:        number;
    url?:                       string;
    node?:                      RelatedNodeClass;
    score?:                     number;
    wastedBytes?:               number;
    totalBytes?:                number;
    subItems?:                  FluffySubItems;
    startTime?:                 number;
    duration?:                  number;
    transferSize?:              number;
    networkEndTime?:            number;
    experimentalFromMainFrame?: boolean;
    entity?:                    Name;
    resourceSize?:              number;
    mimeType?:                  string;
    protocol?:                  Protocol;
    statusCode?:                number;
    priority?:                  Rity;
    rendererStartTime?:         number;
    sessionTargetType?:         SessionTargetType;
    networkRequestTime?:        number;
    finished?:                  boolean;
    resourceType?:              ResourceType;
    origin?:                    string;
    rtt?:                       number;
    wastedMs?:                  number;
    data?:                      string;
    timing?:                    number;
    timestamp?:                 number;
    mainThreadTime?:            number;
    tbtImpact?:                 number;
    blockingTime?:              number;
}

export enum Name {
    GoogleAnalytics = "Google Analytics",
    GoogleFonts = "Google Fonts",
    GoogleTagManager = "Google Tag Manager",
    PrestigesurgeryCOM = "prestigesurgery.com",
}

export enum Protocol {
    Blob = "blob",
    H2 = "h2",
}

export enum ResourceType {
    Document = "Document",
    Fetch = "Fetch",
    Font = "Font",
    Image = "Image",
    Script = "Script",
    Stylesheet = "Stylesheet",
}

export enum SessionTargetType {
    Page = "page",
    Worker = "worker",
}

export interface FluffySubItems {
    items: StickyItem[];
    type:  SubItemsType;
}

export interface StickyItem {
    signal?:         string;
    location?:       Location;
    mainThreadTime?: number;
    tbtImpact?:      number;
    transferSize?:   number;
    blockingTime?:   number;
    url?:            string;
}

export interface PurpleSummary {
    wastedMs:     number;
    wastedBytes?: number;
}

export enum PurpleType {
    Filmstrip = "filmstrip",
    Opportunity = "opportunity",
    Table = "table",
}

export interface BootupTimeMetricSavings {
    TBT?: number;
    CLS?: number;
    LCP?: number;
    FCP?: number;
}

export interface CriticalRequestChains {
    id:               string;
    title:            string;
    description:      string;
    score:            number;
    scoreDisplayMode: ScoreDisplayMode;
    displayValue?:    string;
    details?:         CriticalRequestChainsDetails;
    numericValue?:    number;
    numericUnit?:     string;
    metricSavings?:   CriticalRequestChainsMetricSavings;
    warnings?:        any[];
}

export interface CriticalRequestChainsDetails {
    longestChain?:        LongestChain;
    type:                 string;
    chains?:              Chains;
    items?:               IndigoItem[];
    headings?:            Heading[];
    sortedBy?:            string[];
    overallSavingsMs?:    number;
    debugData?:           TentacledDebugData;
    overallSavingsBytes?: number;
}

export interface Chains {
    "75434717BD0E20603D7BA41DADDFA32C": The75434717Bd0E20603D7Ba41Daddfa32C;
}

export interface The75434717Bd0E20603D7Ba41Daddfa32C {
    children: The75434717BD0E20603D7BA41DADDFA32CChildren;
    request:  Request;
}

export interface The75434717BD0E20603D7BA41DADDFA32CChildren {
    "53.61":  The5310;
    "53.113": The5310;
    "53.47":  The5310;
    "53.64":  The5310;
    "53.99":  The5310;
    "53.28":  The5310;
    "53.8":   The5310;
    "53.23":  The5310;
    "53.11":  The5310;
    "53.12":  The5310;
    "53.22":  The5310;
    "53.52":  The5310;
    "53.25":  The5310;
    "53.2":   The5310;
    "53.124": The5310;
    "53.56":  The5310;
    "53.38":  The5310;
    "53.112": The5310;
    "53.96":  The5310;
    "53.30":  The5310;
    "53.48":  The5310;
    "53.55":  The5355;
    "53.102": The5310;
    "53.31":  The5310;
    "53.105": The5310;
    "53.120": The5310;
    "53.90":  The5310;
    "53.6":   The5310;
    "53.14":  The5310;
    "53.88":  The5310;
    "53.42":  The5310;
    "53.84":  The5310;
    "53.123": The5310;
    "53.116": The5310;
    "53.46":  The5310;
    "53.101": The5310;
    "53.40":  The5310;
    "53.21":  The5310;
    "53.35":  The5310;
    "53.98":  The5310;
    "53.36":  The5310;
    "53.32":  The5310;
    "53.83":  The5310;
    "53.103": The5310;
    "53.41":  The5310;
    "53.37":  The5310;
    "53.92":  The5310;
    "53.50":  The5310;
    "53.60":  The5310;
    "53.62":  The5310;
    "53.44":  The5310;
    "53.15":  The5310;
    "53.51":  The5310;
    "53.106": The5310;
    "53.24":  The5310;
    "53.85":  The5310;
    "53.16":  The5310;
    "53.97":  The5310;
    "53.81":  The5310;
    "53.57":  The5357;
    "53.26":  The5310;
    "53.122": The5310;
    "53.13":  The5310;
    "53.100": The5310;
    "53.108": The5310;
    "53.34":  The5334;
    "53.18":  The5310;
    "53.27":  The5310;
    "53.117": The5310;
    "53.82":  The5310;
    "53.121": The5310;
    "53.126": The5310;
    "53.86":  The5310;
    "53.114": The5310;
    "53.39":  The5310;
    "53.5":   The5310;
    "53.20":  The5310;
    "53.65":  The5310;
    "53.45":  The5310;
    "53.19":  The5310;
    "53.95":  The5310;
    "53.3":   The5310;
    "53.87":  The5310;
    "53.17":  The5310;
    "53.43":  The5310;
    "53.53":  The5310;
    "53.109": The5310;
    "53.7":   The5310;
    "53.118": The5310;
    "53.58":  The5358;
    "53.4":   The5310;
    "53.89":  The5310;
    "53.59":  The5359;
    "53.94":  The5310;
    "53.104": The5310;
    "53.29":  The5310;
    "53.33":  The5310;
    "53.119": The5310;
    "53.93":  The5310;
    "53.10":  The5310;
    "53.54":  The5310;
    "53.9":   The5310;
    "53.107": The5310;
    "53.125": The5310;
    "53.49":  The5310;
    "53.110": The5310;
}

export interface The5310 {
    request: Request;
}

export interface Request {
    startTime:            number;
    endTime:              number;
    responseReceivedTime: number;
    url:                  string;
    transferSize:         number;
}

export interface The5334 {
    children: The5334_Children;
    request:  Request;
}

export interface The5334_Children {
    "53.224": The5310;
}

export interface The5355 {
    request:  Request;
    children: { [key: string]: The5310 };
}

export interface The5357 {
    request:  Request;
    children: The5357_Children;
}

export interface The5357_Children {
    "53.414": The5310;
}

export interface The5358 {
    children: The5358_Children;
    request:  Request;
}

export interface The5358_Children {
    "53.417": The5310;
}

export interface The5359 {
    request:  Request;
    children: The5359_Children;
}

export interface The5359_Children {
    "53.418": The5310;
}

export interface TentacledDebugData {
    metricSavings: DebugDataMetricSavings;
    type:          DebugDataType;
}

export interface IndigoItem {
    headings?:           Heading[];
    items?:              ItemItem[];
    type?:               DebugDataType;
    duration?:           number;
    groupLabel?:         string;
    group?:              string;
    serverResponseTime?: number;
    origin?:             string;
    wastedMs?:           number;
    url?:                string;
    totalBytes?:         number;
    wastedPercent?:      number;
    wastedBytes?:        number;
}

export interface ItemItem {
    node?:    RelatedNodeClass;
    timing?:  number;
    percent?: string;
    phase?:   string;
}

export interface LongestChain {
    duration:     number;
    length:       number;
    transferSize: number;
}

export interface CriticalRequestChainsMetricSavings {
    LCP?: number;
    TBT?: number;
    FCP?: number;
}

export interface CumulativeLayoutShift {
    id:               string;
    title:            string;
    description:      string;
    score:            number | null;
    scoreDisplayMode: ScoreDisplayMode;
    displayValue?:    string;
    details?:         CumulativeLayoutShiftDetails;
    numericValue?:    number;
    numericUnit?:     string;
    metricSavings?:   CumulativeLayoutShiftMetricSavings;
}

export interface CumulativeLayoutShiftDetails {
    type:              string;
    items:             IndecentItem[];
    headings?:         Heading[];
    overallSavingsMs?: number;
    debugData?:        StickyDebugData;
}

export interface StickyDebugData {
    tags:   string[];
    impact: string;
    type:   DebugDataType;
}

export interface IndecentItem {
    cumulativeLayoutShiftMainFrame?:            number;
    newEngineResult?:                           NewEngineResult;
    newEngineResultDiffered?:                   boolean;
    observedFirstVisualChangeTs?:               number;
    observedLastVisualChangeTs?:                number;
    observedFirstVisualChange?:                 number;
    observedLargestContentfulPaintAllFramesTs?: number;
    observedDomContentLoadedTs?:                number;
    observedNavigationStart?:                   number;
    observedCumulativeLayoutShift?:             number;
    observedLoad?:                              number;
    observedTraceEndTs?:                        number;
    observedLargestContentfulPaintAllFrames?:   number;
    observedTimeOrigin?:                        number;
    observedDomContentLoaded?:                  number;
    observedLargestContentfulPaint?:            number;
    observedLoadTs?:                            number;
    timeToFirstByte?:                           number;
    observedTimeOriginTs?:                      number;
    observedFirstContentfulPaintTs?:            number;
    observedLargestContentfulPaintTs?:          number;
    observedFirstPaint?:                        number;
    observedSpeedIndexTs?:                      number;
    lcpLoadEnd?:                                number;
    observedLastVisualChange?:                  number;
    observedNavigationStartTs?:                 number;
    speedIndex?:                                number;
    observedFirstContentfulPaint?:              number;
    totalBlockingTime?:                         number;
    lcpLoadStart?:                              number;
    firstContentfulPaint?:                      number;
    cumulativeLayoutShift?:                     number;
    observedTraceEnd?:                          number;
    observedFirstPaintTs?:                      number;
    observedFirstContentfulPaintAllFramesTs?:   number;
    observedSpeedIndex?:                        number;
    largestContentfulPaint?:                    number;
    observedCumulativeLayoutShiftMainFrame?:    number;
    interactive?:                               number;
    maxPotentialFID?:                           number;
    observedFirstContentfulPaintAllFrames?:     number;
    lcpInvalidated?:                            boolean;
    subItems?:                                  TentacledSubItems;
    node?:                                      RelatedNodeClass;
    responseTime?:                              number;
    url?:                                       string;
}

export interface NewEngineResult {
    cumulativeLayoutShift:          number;
    cumulativeLayoutShiftMainFrame: number;
}

export interface TentacledSubItems {
    type:  SubItemsType;
    items: HilariousItem[];
}

export interface HilariousItem {
    failureReason: FailureReason;
    animation:     Animation;
}

export enum Animation {
    Visibility = "visibility",
}

export enum FailureReason {
    UnsupportedCSSPropertyVisibility = "Unsupported CSS Property: visibility",
}

export interface CumulativeLayoutShiftMetricSavings {
    CLS?: number;
    LCP?: number;
    FCP?: number;
}

export interface DOMSize {
    id:               string;
    title:            string;
    description:      string;
    score:            number;
    scoreDisplayMode: ScoreDisplayMode;
    displayValue?:    string;
    metricSavings?:   CriticalRequestChainsMetricSavings;
    details?:         DOMSizeDetails;
    numericValue:     number;
    numericUnit:      string;
}

export interface DOMSizeDetails {
    headings:             Heading[];
    items:                AmbitiousItem[];
    type:                 PurpleType;
    sortedBy?:            string[];
    overallSavingsBytes?: number;
    overallSavingsMs?:    number;
    debugData?:           TentacledDebugData;
}

export interface AmbitiousItem {
    statistic?:     string;
    value?:         Value;
    node?:          RelatedNodeClass;
    url?:           string;
    totalBytes?:    number;
    wastedPercent?: number;
    wastedBytes?:   number;
}

export interface Value {
    granularity: number;
    type:        ValueTypeEnum;
    value:       number;
}

export interface DuplicatedJavascript {
    id:               string;
    title:            string;
    description:      string;
    score:            number;
    scoreDisplayMode: ScoreDisplayMode;
    metricSavings?:   DebugDataMetricSavings;
    details?:         DuplicatedJavascriptDetails;
    numericValue:     number;
    numericUnit:      string;
    displayValue?:    string;
    warnings?:        any[];
}

export interface DuplicatedJavascriptDetails {
    headings:             Heading[];
    items:                CunningItem[];
    overallSavingsBytes?: number;
    debugData?:           TentacledDebugData;
    type:                 PurpleType;
    sortedBy:             string[];
    overallSavingsMs?:    number;
    summary?:             FluffySummary;
    skipSumming?:         string[];
}

export interface CunningItem {
    wastedBytes:          number;
    url:                  string;
    totalBytes:           number;
    node?:                RelatedNodeClass;
    wastedWebpBytes?:     number;
    isCrossOrigin?:       boolean;
    fromProtocol?:        boolean;
    wastedPercent?:       number;
    requestStartTime?:    number;
    cacheHitProbability?: number;
    cacheLifetimeMs?:     number;
    debugData?:           ItemDebugData;
}

export interface ItemDebugData {
    "max-age": number;
    public:    boolean;
    type:      DebugDataType;
}

export interface FluffySummary {
    wastedBytes: number;
}

export interface UsesRelPreconnect {
    id:               string;
    title:            string;
    description:      string;
    score:            number;
    scoreDisplayMode: ScoreDisplayMode;
    metricSavings:    DebugDataMetricSavings;
    details:          UsesRelPreconnectDetails;
    warnings:         any[];
    numericValue:     number;
    numericUnit:      string;
}

export interface UsesRelPreconnectDetails {
    sortedBy:          string[];
    headings:          Heading[];
    items:             MagentaItem[];
    summary?:          TentacledSummary;
    type:              PurpleType;
    overallSavingsMs?: number;
}

export interface MagentaItem {
    scripting:          number;
    total:              number;
    scriptParseCompile: number;
    url:                string;
}

export interface TentacledSummary {
    wastedMs: number;
}

export interface Viewport {
    id:               string;
    title:            string;
    description:      string;
    score:            number;
    scoreDisplayMode: ScoreDisplayMode;
    metricSavings:    ViewportMetricSavings;
    details:          ViewportDetails;
    warnings:         any[];
}

export interface ViewportDetails {
    type:            DebugDataType;
    viewportContent: string;
}

export interface ViewportMetricSavings {
    INP: number;
}

export interface Categories {
    performance:      BestPractices;
    accessibility:    Accessibility;
    "best-practices": BestPractices;
    seo:              Accessibility;
}

export interface Accessibility {
    id:                string;
    title:             string;
    description:       string;
    score:             number;
    manualDescription: string;
    auditRefs:         AuditRef[];
}

export interface AuditRef {
    id:       string;
    weight:   number;
    group?:   string;
    acronym?: string;
}

export interface BestPractices {
    id:        string;
    title:     string;
    score:     number;
    auditRefs: AuditRef[];
}

export interface CategoryGroups {
    "a11y-best-practices":           A11YAria;
    "best-practices-browser-compat": BestPracticesBrowserCompat;
    "seo-crawl":                     A11YAria;
    "best-practices-general":        BestPracticesBrowserCompat;
    "a11y-language":                 A11YAria;
    "a11y-aria":                     A11YAria;
    "seo-content":                   A11YAria;
    "a11y-names-labels":             A11YAria;
    "seo-mobile":                    A11YAria;
    "a11y-tables-lists":             A11YAria;
    "best-practices-trust-safety":   BestPracticesBrowserCompat;
    "a11y-navigation":               A11YAria;
    "a11y-audio-video":              A11YAria;
    diagnostics:                     A11YAria;
    "a11y-color-contrast":           A11YAria;
    metrics:                         BestPracticesBrowserCompat;
    "best-practices-ux":             BestPracticesBrowserCompat;
}

export interface A11YAria {
    title:       string;
    description: string;
}

export interface BestPracticesBrowserCompat {
    title: string;
}

export interface ConfigSettings {
    emulatedFormFactor: string;
    formFactor:         string;
    locale:             string;
    onlyCategories:     string[];
    channel:            string;
}

export interface Entity {
    name:            Name;
    isFirstParty?:   boolean;
    isUnrecognized?: boolean;
    origins:         string[];
    homepage?:       string;
    category?:       string;
}

export interface Environment {
    networkUserAgent: string;
    hostUserAgent:    string;
    benchmarkIndex:   number;
    credits:          Credits;
}

export interface Credits {
    "axe-core": string;
}

export interface FullPageScreenshot {
    nodes:      { [key: string]: NodeValue };
    screenshot: Screenshot;
}

export interface Screenshot {
    height: number;
    width:  number;
    data:   string;
}

export interface I18N {
    rendererFormattedStrings: RendererFormattedStrings;
}

export interface RendererFormattedStrings {
    varianceDisclaimer:               string;
    opportunityResourceColumnLabel:   string;
    opportunitySavingsColumnLabel:    string;
    errorMissingAuditInfo:            string;
    errorLabel:                       string;
    warningHeader:                    string;
    passedAuditsGroupTitle:           string;
    notApplicableAuditsGroupTitle:    string;
    manualAuditsGroupTitle:           string;
    toplevelWarningsMessage:          string;
    crcLongestDurationLabel:          string;
    crcInitialNavigation:             string;
    lsPerformanceCategoryDescription: string;
    labDataTitle:                     string;
    warningAuditsGroupTitle:          string;
    snippetExpandButtonLabel:         string;
    snippetCollapseButtonLabel:       string;
    thirdPartyResourcesLabel:         string;
    runtimeDesktopEmulation:          string;
    runtimeMobileEmulation:           string;
    runtimeNoEmulation:               string;
    runtimeSettingsBenchmark:         string;
    runtimeSettingsCPUThrottling:     string;
    runtimeSettingsDevice:            string;
    runtimeSettingsNetworkThrottling: string;
    runtimeSettingsUANetwork:         string;
    runtimeUnknown:                   string;
    dropdownCopyJSON:                 string;
    dropdownDarkTheme:                string;
    dropdownPrintExpanded:            string;
    dropdownPrintSummary:             string;
    dropdownSaveGist:                 string;
    dropdownSaveHTML:                 string;
    dropdownSaveJSON:                 string;
    dropdownViewer:                   string;
    footerIssue:                      string;
    throttlingProvided:               string;
    calculatorLink:                   string;
    runtimeSettingsAxeVersion:        string;
    viewTreemapLabel:                 string;
    showRelevantAudits:               string;
}

export interface StackPack {
    id:           string;
    title:        string;
    iconDataURL:  string;
    descriptions: Descriptions;
}

export interface Descriptions {
    "render-blocking-resources":  string;
    "unminified-javascript":      string;
    "unused-css-rules":           string;
    "uses-responsive-images":     string;
    "unminified-css":             string;
    "modern-image-formats":       string;
    "server-response-time":       string;
    "total-byte-weight":          string;
    "uses-text-compression":      string;
    "efficient-animated-content": string;
    "unused-javascript":          string;
    "offscreen-images":           string;
    "uses-long-cache-ttl":        string;
    "uses-optimized-images":      string;
}

export interface Timing {
    total: number;
}

export interface LoadingExperience {
    initial_url: string;
}
