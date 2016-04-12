var loaderUtils = require('loader-utils');
var sizeOf = require('image-size');
var fs = require('fs');

var imageToString = function (image, query) {
    var radio = query.radio || 1,
        attrs = query.attrs;

    if (attrs.indexOf('width') != -1) {
        image.width = image.width / radio;
    }

    if (attrs.indexOf('height') != -1) {
        image.height = image.height / radio;
    }

    var result = {
        'src': '  src: __webpack_public_path__ + {src},\n',
        'width': '  width: {width},\n',
        'height': '  height: {height},\n',
        'bytes': '  bytes: {bytes},\n',
        'type': '  type: {type},\n',
    };

    function getImageInfo(attrs) {

        var tmp = '',
            attr = '';
        for (var i = 0, len = attrs.length; i < len; i++) {
            attr = attrs[i];
            if (result[attr]) {
                tmp += result[attr].replace('{' + attr + '}', JSON.stringify(image[attr]));
            }
        }
        return tmp;
    }

    return 'module.exports = {' + '\n' +
        getImageInfo(attrs)
        + '};' + '\n'

            // For requires from CSS when used with webpack css-loader,
            // outputting an Object doesn't make sense,
            // So overriding the toString method to output just the URL
        + 'module.exports.toString = function() {' + '\n'
        + '  return __webpack_public_path__ + ' + JSON.stringify(image.src) + ';\n'
        + '};';
};

function getExportImageAttrs(attrs) {

    if (!attrs) {
        attrs = ['width', 'height'];
    } else if (attrs == 'simple') {
        attrs = ['src', 'width', 'height', 'bytes', 'type'];
    } else {
        attrs = attrs.split('|');
    }

    return attrs;
}

module.exports = function (content) {

    this.cacheable && this.cacheable(true);
    if (!this.emitFile) throw new Error('emitFile is required from module system');
    this.addDependency(this.resourcePath);

    var query = loaderUtils.parseQuery(this.query);
    var filename = "[name].[ext]";

    if ('string' === typeof query.name) {
        filename = query.name;
    }
    query.attrs = getExportImageAttrs(query.attrs);


    var url = loaderUtils.interpolateName(this, filename, {
        context: query.context || this.options.context,
        content: content,
        regExp: query.regExp
    });

    var image = sizeOf(this.resourcePath);
    var attrs = query.attrs;

    image.src = url;

    if (attrs.indexOf('bytes') != -1) {
        image.bytes = fs.statSync(this.resourcePath).size;
    }

    if (query.write) {
        this.emitFile(url, content);
    }

    return imageToString(image, query);

};

module.exports.raw = true;
