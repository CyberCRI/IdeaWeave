angular.module('cri.common')
    .filter('timeago', function ($translate) {
        return function (input) {
            if($translate.uses() === "en"){
                var templates = {
                    prefix: "",
                    suffix: " ago",
                    seconds: "less than a minute",
                    minute: "about a minute",
                    minutes: "%d minutes",
                    hour: "about an hour",
                    hours: "about %d hours",
                    day: "a day",
                    days: "%d days",
                    month: "about a month",
                    months: "%d months",
                    year: "about a year",
                    years: "%d years"
                };
            }else if($translate.uses() === "zh_CN"){
                var templates = {
                    prefix: "",
                    suffix: " 前",
                    seconds: "少于1分钟",
                    minute: "大概1分钟",
                    minutes: "%d 分钟",
                    hour: "大概一小时",
                    hours: "大概 %d 小时",
                    day: "1天",
                    days: "%d 天",
                    month: "大概一个月",
                    months: "%d 月",
                    year: "大概一年",
                    years: "%d 年"
                };
            }
            var template = function (t, n) {
                return templates[t] && templates[t].replace(/%d/i, Math.abs(Math.round(n)));
            };

            var timer = function (time) {
                if (!time)
                    return;

                var now = new Date();
                var seconds = ((now.getTime() - time) * .001) >> 0;
                var minutes = seconds / 60;
                var hours = minutes / 60;
                var days = hours / 24;
                var years = days / 365;

                return templates.prefix + (
                    seconds < 45 && template('seconds', seconds) ||
                    seconds < 90 && template('minute', 1) ||
                    minutes < 45 && template('minutes', minutes) ||
                    minutes < 90 && template('hour', 1) ||
                    hours < 24 && template('hours', hours) ||
                    hours < 42 && template('day', 1) ||
                    days < 30 && template('days', days) ||
                    days < 45 && template('month', 1) ||
                    days < 365 && template('months', days / 30) ||
                    years < 1.5 && template('year', 1) ||
                    template('years', years)
                    ) + templates.suffix;
            };

            return timer(input);
        }
    })
    .filter('propsFilter', function() {
        return function(items, props) {
            var out = [];

            if (angular.isArray(items)) {
                items.forEach(function(item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        }
    });
