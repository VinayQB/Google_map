$(document).ready(function(){
    function svgToCanvas (targetElem) {
        var nodesToRecover = [];
        var nodesToRemove = [];

        var svgElem = targetElem.find('svg');

        svgElem.each(function(index, node) {
            var parentNode = node.parentNode;
            var svg = parentNode.innerHTML;

            var canvas = document.createElement('canvas');

            canvg(canvas, svg);

            nodesToRecover.push({
                parent: parentNode,
                child: node
            });
            parentNode.removeChild(node);

            nodesToRemove.push({
                parent: parentNode,
                child: canvas
            });

            parentNode.appendChild(canvas);
        });

        html2canvas(targetElem, {
            onrendered: function(canvas) {
                var ctx = canvas.getContext('2d');
                ctx.webkitImageSmoothingEnabled = false;
                ctx.mozImageSmoothingEnabled = false;
                ctx.imageSmoothingEnabled = false;
            }
        });
    }

    function getPDFImageSize(htmlElement) {

        var img_height = $(htmlElement).height();
        var img_width = $(htmlElement).width();
        var heightRatio;
        var MAX_WIDTH = 950;

        if (img_width > MAX_WIDTH) {
            heightRatio = (img_width / MAX_WIDTH);
            img_width = MAX_WIDTH;
            img_height = (img_height / heightRatio);
        }

        var aspect_ratio = (img_width / img_height);

        img_width = (img_width / 5);
        img_height = (img_width / aspect_ratio);

        return {
            height: img_height,
            width: img_width
        };
    }

    function convertToPDF(canvasImg) {
        var doc = new jsPDF();
        doc.setFontSize(10);
        var graphImageSize = getPDFImageSize("#target");
        var graphWidth = graphImageSize.width;
        var graphHeight = graphImageSize.height;
        doc.addImage(canvasImg, 'JPEG', 2, 2, graphWidth, graphHeight);
        doc.save('Route_explorer.pdf');
    }

    $('#cmd').on("click", function () {
        svgToCanvas( $('#target') );
        var canvasImg;
        var options = {
            orientation: "l",
            unit: "pt",
            format: "letter",
            zoomed: "fullpage",
            onrendered: function(canvas) {
                canvasImg = canvas.toDataURL('image/jpeg');
                convertToPDF(canvasImg);
            }
        };

        html2canvas(document.body, options);
        
    });
});