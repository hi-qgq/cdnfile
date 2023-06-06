/*
* FeedEk jQuery RSS/ATOM Feed Plugin v3.0 with YQL API
* http://jquery-plugins.net/FeedEk/FeedEk.html  https://github.com/enginkizil/FeedEk
* Author : Engin KIZIL http://www.enginkizil.com   
*/

(function ($) {
    $.fn.FeedEk = function (opt) {
        var def = $.extend({
            FeedUrl: "http://jquery-plugins.net/rss",
            MaxCount: 5,
            ShowDesc: true,
            ShowPubDate: true,
            DescCharacterLimit: 0,
            TitleLinkTarget: "_blank",
            DateFormat: "",
            DateFormatLang: "en"
        }, opt);

        var $id = $(this), i, s = "", dt;
        $id.empty().append('<img src="App_Themes/DefaultTheme/Images/ajax-loader_square_circle.gif" />');

        var YQLstr = 'SELECT channel.item FROM feednormalizer WHERE output="rss_2.0" AND url ="' + def.FeedUrl + '" LIMIT ' + def.MaxCount;

        $.ajax({
            url: "https://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(YQLstr) + "&format=json&diagnostics=true&callback=?",
            dataType: "json",   
            success: function (data) {
                $id.empty();
                $.each(data.query.results.rss, function (e, itm) {

                    if (def.newsname == "#rapa") {
                        var img;
                        img = itm.channel.item.link;
                        img = img.replace("NewsItem.aspx", "GetImage.aspx");
                        s += '<li class="media"><div class="media">' +
                                '<div class="media-left"> ' +
                                    ' <a href="' + itm.channel.item.link + '">' +
                                        ' <img class="media-object" src=' + img + '&ImageTypeID=3  alt="Image" style="width: 140px; border-width: 0px;">' +
                                    '</a>' +
                                '</div>' +
                                '<div class="media-body">' +
                                    '<a class="media-heading h4" href="' + itm.channel.item.link + '">' + itm.channel.item.title + '</a>' +
                                    '<div class="rssDate"><em>published :' + itm.channel.item.pubDate + '</em></div>' +
                                    '<div class="rssDesc">' + itm.channel.item.description + '</div>' +
                                '</div>' +
                            '</div><hr/>';
                    }
                    else {
                        //                        var x
                        //                        x += '<li><div class="itemTitle"><a href="' + itm.channel.item.link + '" target="' + def.TitleLinkTarget + '" >' + itm.channel.item.title + '</a></div>';


                        s += '<li class="media"><div class="media">'

                        if (def.newsname == "#toi") {

                            var x = $($.parseHTML(itm.channel.item.description)[0]);
                            //x = x.filter('a');

                            s += '<div class="media-left"> ' +
                                    ' <a href="' + $(x).attr('href') + '">' +
                                    ' <img class="media-object" src=' + $(x).find('img').attr('src') + '&ImageTypeID=3  alt="Image" style="width: 140px; border-width: 0px;">' +
                                    '</a>' +
                                '</div>'



                        } else {
                            s += '<div class="media-left"> ' +
                             ' <a href="' + itm.channel.item.link + '">' +
                             '</a>' +
                                    '</div>';
                        }


                        s += '<div class="media-body">' +
                                        '<a class="media-heading h4" href="' + itm.channel.item.link + '">' + itm.channel.item.title + '</a>'

                        //                        if (def.ShowPubDate) {
                        //                            dt = new Date(itm.channel.item.pubDate);
                        //                            s += '<div class="rssDate">';
                        //                            if ($.trim(def.DateFormat).length > 0) {
                        //                                try {
                        //                                    moment.lang(def.DateFormatLang);
                        //                                    s += '<em>'+moment(dt).format(def.DateFormat)+'</em>';
                        //                                }
                        //                                catch (e) { s += '<em>' + dt.toLocaleDateString()+'</em>'; }
                        //                            }
                        //                            else {
                        //                                s += '<em>' + dt.toLocaleDateString()+'</em>';
                        //                            }
                        //                            s += '</div>';
                        //                        }

                        s += '<div class="rssDate"><em>published :' + itm.channel.item.pubDate + '</em></div>'

                        //                        if (def.ShowDesc) {
                        //                            s += '<div class="rssDesc">';
                        //                            if (def.DescCharacterLimit > 0 && itm.channel.item.description.length > def.DescCharacterLimit) {
                        //                                s += itm.channel.item.description.substring(0, def.DescCharacterLimit) + '...';
                        //                            }
                        //                            else {
                        //                                s += itm.channel.item.description;
                        //                            }
                        //                            s += '</div>';
                        //                        }
                        if (def.newsname == "#toi") {
                            var tx = $.parseHTML(itm.channel.item.description)[1];
                            s += '<div class="rssDesc">' + $(tx).text(); +'</div>'
                        } else {
                            s += '<div class="rssDesc">' + itm.channel.item.description + '</div>'
                        }
                        s += '</div>' +
                                '</div></li><hr/>'
                    }
                });

                $id.append('<ul class="media-list">' + s + "</ul>");
            }
        });
    };
})(jQuery);