/**
* jquery.databar - jQuery plugin for Excel-style data bar.
* https://github.com/ts-3156/databar
* Released under the MIT license
*/
(function ($) {
    var ColorMaker = function (options) {
        var options = options || {};
        this.options = $.extend({}, options);

        this.color = (function (self) {
            var n = 0;
            var backgroundOpacity = (self.options.backgroundOpacity || 0.3);
            // solarized colors
            // http://ethanschoonover.com/solarized
            var colors = [
            'rgba(108, 113, 196, ' + backgroundOpacity + ')', // '#6c71c4',
            'rgba(220, 50, 47, ' + backgroundOpacity + ')',   // '#dc322f',
            'rgba(203, 75, 22, ' + backgroundOpacity + ')',   // '#cb4b16',
          'rgba(181, 137, 0, ' + backgroundOpacity + ')',   // '#b58900',          
          'rgba(211, 54, 130, ' + backgroundOpacity + ')',  // '#d33682',          
          'rgba(38, 139, 210, ' + backgroundOpacity + ')',  // '#268bd2',
          'rgba(42, 161, 152, ' + backgroundOpacity + ')',  // '#2aa198',
          'rgba(133, 153, 0, ' + backgroundOpacity + ')'    // '#859900'
      ];
            return function () {
                n++;
                if (n >= colors.length) {
                    n = 0;
                }
                return colors[n];
            };
        })(this);
    };

    var throw_if_invalid_html = function ($table) {
        //        if ($table.find('thead').length == 0) {
        //            throw 'thead not found. please use thead, th, tbody, tr and td.';
        //        }
        if ($table.find('tbody').length == 0) {
            throw 'tbody not found. please use thead, th, tbody, tr and td.';
        }
        if ($table.find('tbody tr').length == 0) {
            //throw 'tr not found. please use thead, th, tbody, tr and td.';
        }
        if ($table.find('tbody tr td').length == 0) {
            //throw 'td not found. please use thead, th, tbody, tr and td.';
        }
    };

    $.fn.databar = function (options) {
        var options = options || {};
        var colorMaker = new ColorMaker(options);

        options.css = $.extend({
            textAlign: 'right'
        }, options.css);


        var $table = $(this);
        throw_if_invalid_html($table);
        var column_size = 1
        var all_data = $table.hasClass('all');
        if (all_data) {
            column_size = 1
        } else {
            column_size = $table.find('tbody tr').first().find('td').length;
        }

        for (var i = 0; i < column_size; i++) {
            var $vertical_tds;
            if (all_data) {
                $vertical_tds = $table.find('tbody td:not(.databar-ignore)');
            } else {
                //$vertical_tds = $table.find('tbody tr > :nth-child(' + (i + 1) + ')');
                $vertical_tds = $table.find('tbody tr > :nth-child(' + (i + 1) + '):not(.databar-ignore)');
            }

            var numbers = $vertical_tds.map(function (i) {
                var text = $(this).text();

                var stripped = text.replace(/[\s,%$円€\\]/g, '');
                if ($.isNumeric(stripped)) {
                    return parseFloat(stripped);
                } else {
                    return false;
                }
            });

            (function ($tds, options) {
                var metrics = {};
                metrics['100%'] = Math.max.apply(null, numbers);
                var color = colorMaker.color();

                $tds.each(function (i) {
                    var $td = $(this);

                    if (numbers[i] === false) {
                        return true;
                    }
                    if ($td.hasClass('databar-ignore')) {
                        return true;
                    }


                   /* $td.css("background", "-webkit-linear-gradient(left, rgba(255,255,255,1) 0%,rgba(249,249,249,1) " + (100 * numbers[i] / metrics['100%']) + "%,rgba(32,124,202,1) 100%)");*/
                    /*                    
background: rgb(255,255,255); 
background: -moz-linear-gradient(left, rgba(255,255,255,1) 0%, rgba(249,249,249,1) 52%, rgba(32,124,202,1) 100%); 
background: -webkit-linear-gradient(left, rgba(255,255,255,1) 0%,rgba(249,249,249,1) 52%,rgba(32,124,202,1) 100%); 
background: linear-gradient(to right, rgba(255,255,255,1) 0%,rgba(249,249,249,1) 52%,rgba(32,124,202,1) 100%); 
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#207cca',GradientType=1 ); 
*/

                    

                   

                    
                    if ($td.find("span.bar-span").length == 0) {

                        var $bar = $('<span class="bar-span" />')
                               .css($.extend({
                                   'position': 'absolute',
                                   'top': 0,
                                   'left': 0,
                                   'right': 0,
                                   'zIndex': 0,
                                   'display': 'block',
                                   'height': '100%',
                                   'width': (100 * numbers[i] / metrics['100%']) + '%',
                                   'backgroundColor': color
                               }, options.css));

                        $td.prepend($bar);

                        $td.wrapInner($('<div class="bar-div" />')
                                                .css({
                                                    'position': 'relative',
                                                    'min-height': '1.5em' // float bug fix
                                                }));

                    } else {

                        $td.find('span.bar-span').css($.extend({ 'width': (100 * numbers[i] / metrics['100%']) + '%' }, options.css));

                    }

                    

                });
            })($vertical_tds, options);
        }

        return this;
    }
} (jQuery));
