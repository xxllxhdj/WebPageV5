angular.module('angularWeb')
    .factory('ExtDialog', ['$rootScope', '$q', '$alert', '$modal',
        function($rootScope, $q, $alert, $modal) {
            var o = {},
                loaderInstance;

            o.showLoading = function () {
                return createLoading();
            };

            o.hideLoading = function () {
                if (loaderInstance) {
                    loaderInstance.hide();
                }
            };

            o.tip = function(content, options) {
                var defaults = {
                    content: content,
                    placement: 'bottom',
                    container: 'body',
                    type: 'custom',
                    show: true,
                    animation: 'am-fade-and-slide-top'
                };
                $alert(angular.extend(defaults, options));
            };

            o.alert = function (content, title, options) {
                options = options ? options : {};
                angular.extend(options, {
                    title: title || '提示框',
                    content: content,
                    buttons: [{
                        text: options.okText || '确 认',
                        type: options.okType || 'button-ok',
                        onTap: function() {
                            return true;
                        }
                    }]
                });
                return createPopup(options);
            };

            o.confirm = function (content, title, options) {
                options = options ? options : {};
                angular.extend(options, {
                    title: title || '确认框',
                    content: content,
                    buttons: [{
                        text: options.okText || '确 认',
                        type: options.okType || 'button-ok',
                        onTap: function() {
                            return true;
                        }
                    }, {
                        text: options.cancelText || '取 消',
                        type: options.cancelType || 'button-cancel',
                        onTap: function() {
                            return false;
                        }
                    }]
                });
                return createPopup(options);
            };

            return o;

            function createLoading() {
                if (loaderInstance) {
                    return loaderInstance;
                }
                loaderInstance = $modal({
                    placement: 'center',
                    show: true,
                    templateUrl: 'tpls/utility/loading.tpl.html',
                    backdrop: false
                });
                return loaderInstance;
            }

            function createPopup (options) {
                options = options ? options : {};
                var responseDeferred = $q.defer(),
                    defaults = {
                        placement: 'center',
                        show: true,
                        animation: 'am-fade-and-scale',
                        templateUrl: 'tpls/utility/popup.tpl.html',
                        backdrop: false
                    };
                defaults.scope = (options.scope || $rootScope).$new();
                angular.extend(defaults, options);
                angular.extend(defaults.scope, {
                    buttons: defaults.buttons,
                    $buttonTapped: function(button, event) {
                        var result = (button.onTap || angular.noop)(event);
                        event = event.originalEvent || event; //jquery events
                        if (!event.defaultPrevented) {
                            responseDeferred.resolve(result);
                        }
                    }
                });
                $modal(defaults);

                return responseDeferred.promise;
            }
        }
    ]);
