/*
* FeedEk jQuery RSS/ATOM Feed Plugin v2.0
* http://jquery-plugins.net/FeedEk/FeedEk.html  https://github.com/enginkizil/FeedEk
* Author : Engin KIZIL http://www.enginkizil.com   
*/

(function ($) {
    $.fn.FeedEk = function (opt) {
        var def = $.extend({
            FeedUrl: "http://rss.cnn.com/rss/edition.rss",
            MaxCount: 10,
            ShowDesc: true,
            ShowPubDate: true,
            CharacterLimit: 0,
            TitleLinkTarget: "_blank",
            DateFormat: "",
            DateFormatLang:"en",
            newsname:""
        }, opt);

        var $id = $(this), i, s = "",dt;
        $id.empty().append('<img src="App_Themes/DefaultTheme/Images/ajax-loader_square_circle.gif" />');

        //url: "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=" + def.MaxCount + "&output=json&q=" + encodeURIComponent(def.FeedUrl) + "&hl=en&callback=?",

        $.ajax({
            url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'" + encodeURIComponent(def.FeedUrl) + "'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?",
            dataType: "json",
            success: function (data) {
                $id.empty();
                //data.responseData.feed.entries
                $.each(data.query.results.rss.channel, function (e, item) {

                    if(def.newsname=="#rapa")
                    {
                        var img;
                        img=item.link;
                        img = img.replace("NewsItem.aspx", "GetImage.aspx");
                        s += '<li class="media"><div class="media">' +
                                '<div class="media-left"> ' +
                                    ' <a href="' + item.link + '">' +
                                        ' <img class="media-object" src='+img+'&ImageTypeID=3  alt="Image" style="width: 140px; border-width: 0px;">'+
                                    '</a>'+
                                '</div>'+
                                '<div class="media-body">'+
                                    '<a class="media-heading h4" href="' + item.link + '">'+ item.title +'</a>'+
                                    '<div class="rssDate"><em>published :'+item.publishedDate+'</em></div>'+
                                    '<div class="rssDesc">'+item.content+'</div>'+
                                '</div>'+
                            '</div><hr/>';
                    }else{                    
                    
                        s += '<li><div class="itemTitle"><a href="' + item.link + '" target="' + def.TitleLinkTarget + '" >' + item.title + "</a></div>";
                    
                        if (def.ShowPubDate){
                            dt= new Date(item.publishedDate);
                            if ($.trim(def.DateFormat).length > 0) {
                                try {
                                    moment.lang(def.DateFormatLang);
                                    s += '<div class="itemDate">' + moment(dt).format(def.DateFormat) + "</div>";
                                }
                                catch (e){s += '<div class="itemDate">' + dt.toLocaleDateString() + "</div>";}                            
                            }
                            else {
                                s += '<div class="itemDate">' + dt.toLocaleDateString() + "</div>";
                            }                        
                        }
                        if (def.ShowDesc) {
                            if (def.DescCharacterLimit > 0 && item.content.length > def.DescCharacterLimit) {
                                s += '<div class="itemContent">' + item.content.substr(0, def.DescCharacterLimit) + "...</div><hr/>";
                            }
                            else {
                                s += '<div class="itemContent">' + item.content + "</div><hr/>";
                            }
                        }
                    }
                });
                $id.append('<ul class="media-list">' + s + "</ul>");
            }
        });
    };
})(jQuery);