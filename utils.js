var FB = require('fb');

function getData(callback) {

    var data = [];

    FB.api(
        `/oauth/access_token?client_id=203960006802301&client_secret=32bd7b996f241c4a124c86e31076a4d4&grant_type=client_credentials`,
        'GET',
        function(res) {
            //console.log(res);
            var access_token = res.access_token;

            FB.api(
                '/1318887898209867',
                'GET',
                {
                    fields: 'videos{embed_html},feed{message,type,attachments}',
                    access_token
                },
                function(res) {
                    var post = {};
                    res.feed.data.forEach(i => {
                        //   console.log("게시물 id: "+i.id);
                        post.id = i.id;
                        //   console.log("내용 : " + (i.message || ""));
                        post.message = i.message || '';
                        //   console.log(i.type);
                        post.type = i.type;

                        if (i.attachments) {
                            var attach = i.attachments.data[0];

                            if (attach.subattachments) {
                                post.media = [];
                                attach.subattachments.data.forEach(sub => {
                                    //console.log("image src : " + sub.description+ "\n" + sub.media.image.src);
                                    post.media.push({
                                        description: sub.description,
                                        src: sub.media.image.src
                                    });
                                });
                            } else {
                                if (attach.type.includes('photo')) {
                                    //console.log(attach.media.image.src);
                                    post.media = attach.media.image.src;
                                }
                                if (attach.type.includes('video')) {
                                    //console.log(res.videos.data[0].embed_html);
                                    post.media = res.videos.data[0].embed_html;
                                }
                            }
                            data.push(post);
                            post = {};
                        }
                    });
                    //console.log(data);
                    return callback(data);
                }
            );
        }
    );
}

module.exports = getData;