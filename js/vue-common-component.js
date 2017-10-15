/**
 * Created by 陈继斌 on 2017/9/26.
 */
Vue.component('bs-scroll', {
    template: '<div class="slide" ref="slide"><div class="slide-group clearfix" ref="slideGroup"><slot></slot></div> <div v-if="showDot" class="dots"> <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span> </div> </div>',
    data: function () {
        return {
            dots: [],
            currentPageIndex: 0
        }
    },
    props: {
        autoPlay: {
            type: Boolean,
            default: true
        },
        loop: {
            type: Boolean,
            default: true
        },
        interval: {
            type: Number,
            default: 4000
        },
        showDot: {
            type: Boolean,
            default: true
        },
        click: {
            type: Boolean,
            default: true
        },
        isBeforeScrollStart: {
            type: Boolean,
            default: false
        },
        isEndScrollStart: {
            type: Boolean,
            default: false
        }
    },
    mounted: function() {
        var that = this
        setTimeout(function () {
            that._setSlideWidth()
            if (that.showDot) {
                that._initDots()
            }
            that._initSlide()
            if (that.autoPlay) {
                that._play()
            }
        }, 20)
        window.addEventListener('resize', function () {
            if (!that.slide || !that.slide.enabled) {
                return
            }
            clearTimeout(that.resizeTimer)
            that.resizeTimer = setTimeout(function () {
                if (that.slide.isInTransition) {
                    that._onScrollEnd()
                } else {
                    if (that.autoPlay) {
                        that._play()
                    }
                }
                that.refresh()
            }, 60)
        })
    },
    activated: function() {
        if (!this.slide) {
            return
        }
        this.slide.enable()
        var pageIndex = this.slide.getCurrentPage().pageX
        if (pageIndex > this.dots.length) {
            pageIndex = pageIndex % this.dots.length
        }
        this.slide.goToPage(pageIndex, 0, 0)
        if (this.loop) {
            pageIndex -= 1
        }
        this.currentPageIndex = pageIndex
        if (this.autoPlay) {
            this._play()
        }
    },
    deactivated: function() {
        this.slide.disable()
        clearTimeout(this.timer)
    },
    beforeDestroy: function() {
        this.slide.disable()
        clearTimeout(this.timer)
    },
    methods: {
        refresh: function() {
            this._setSlideWidth(true)
            this.slide.refresh()
        },
        next: function() {
            this.slide.next()
        },
        _setSlideWidth: function(isResize) {
            this.children = this.$refs.slideGroup.children

            var width = 0
            var slideWidth = this.$refs.slide.clientWidth
            for (var i = 0; i < this.children.length; i++) {
                var child = this.children[i]
                $(child).addClass('slide-item')
                child.style.width = slideWidth + 'px'
                width += slideWidth
            }
            if (this.loop && !isResize) {
                width += 2 * slideWidth
            }
            this.$refs.slideGroup.style.width = width + 'px'
        },
        _initSlide: function() {
            var that = this;
            that.slide = new BScroll(that.$refs.slide, {
                scrollX: true,
                momentum: false,
                snap: {
                    loop: that.loop,
                    threshold: 0.3,
                    speed: 400
                },
                click: that.click
            })

            that.slide.on('scrollEnd', function() {
                if(that.isEndScrollStart) {
                    that.$emit('scroll-end');
                }
                that._onScrollEnd();
            })

            that.slide.on('touchend', function () {
                if (that.autoPlay) {
                    that._play()
                }
            })
            that.slide.on('beforeScrollStart', function () {
                if(that.isBeforeScrollStart) {
                    that.$emit('before-scroll-start');
                }
                if (that.autoPlay) {
                    clearTimeout(that.timer)
                }
            })
        },
        _onScrollEnd: function() {
            var pageIndex = this.slide.getCurrentPage().pageX
            if (this.loop) {
                pageIndex -= 1
            }
            this.currentPageIndex = pageIndex
            if (this.autoPlay) {
                this._play()
            }
        },
        _initDots: function() {
            this.dots = new Array(this.children.length)
        },
        _play: function() {
            var that = this
            var pageIndex = that.slide.getCurrentPage().pageX + 1
            clearTimeout(that.timer)
            that.timer = setTimeout(function () {
                    that.slide.goToPage(pageIndex, 0, 400)
                },
                that.interval
            )
        }
    }
});

Vue.component('fs-rate', {
    template: '<div class="vue-rate-wrapper"><div v-if="!openClick"><span v-for="item in fullPoint" :class="{active: item <= rate}" class="star"><i class="fa fa-star" aria-hidden="true"></i></span></div><div v-else><span @click="_setRate(item)" v-for="item in fullPoint" :class="{active: item <= rate}" class="star"><i class="fa fa-star" aria-hidden="true"></i></span></div></div>',
    props: {
        rate: {
            type: Number,
            default: 5
        },
        fullPoint: {
            type: Number,
            default: 5
        },
        openClick: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        _setRate: function(item) {
            this.$emit('star-click', item)
        }
    }
})

Vue.component('picker', {
    
})



