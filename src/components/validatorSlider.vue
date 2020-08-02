<template>
  <div class="drag_box">
    <div id="drag">
        <div class="drag_bg weui-btn_primary" :style="{width:curW+'px'}"></div>
        <div class="drag_text" onselectstart="return false;" unselectable="on":class="[isDragOk ? 'whitecolor':'']">{{text}}</div>
        <div :id="markId" class="handler" :style="{left:(curW-1)+'px'}" :class="[isDragOk ? 'handler_ok_bg':'handler_bg']"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "slider",
  props: {},
  data() {
    return {
      curW: 0,
      isMove: false, //是否在运动
      isDragOk: false, //是否拖动成功
      maxWidth: 0, //拖动的最大宽度
      element: {},
      text: "拖动滑块验证",
      currentPos: {
        x: 0,
        y: 0
      }
    };
  },
  props:['markId'],
  created() {
  },
  mounted() {
    var self = this;
    this.element = document.querySelector("#"+this.markId);
    this.getMaxWidth();
    window.addEventListener("resize", function() {
      self.getMaxWidth();
    });
    window.addEventListener("orientationchange", function() {
      self.getMaxWidth();
    });
    this.element.addEventListener("touchstart", self.touchstartFun, false);
    document
      .querySelector("body")
      .addEventListener("touchmove", self.touchmoveFun, false);
    document
      .querySelector("body")
      .addEventListener("touchend", self.touchendFun, false);

    this.element.addEventListener("mousedown", self.touchstartFun, false);
    document
      .querySelector("body")
      .addEventListener("mousemove", self.touchmoveFun, false);
    document
      .querySelector("body")
      .addEventListener("mouseup", self.touchendFun, false);

    (function drawAnimate() {
      if (self.curW <= self.maxWidth) {
        window.requestAnimationFrame(drawAnimate, 1000 / 60);
        self.curW = self.currentPos.x;
      } else {
        self.curW = self.currentPos.x = self.maxWidth;
      }
    })();
  },
  watch: {},
  methods: {
    touchstartFun(e) {
      if (this.isDragOk) {
        e.preventDefault();
        return;
      }
      this.isMove = true;
      this.curW = this.currentPos.x = this.getCurrentPosition(e).x;
    },
    touchmoveFun(e) {
      if (this.isMove && this.curW > 0 && this.curW < this.maxWidth) {
        this.currentPos.x = this.getCurrentPosition(e).x;
      } else if (this.isMove && this.curW >= this.maxWidth) {
        this.curW = this.currentPos.x = this.maxWidth;
        this.isDragOk = true;
        this.text = "验证通过";
        this.$emit('drag-ok');
      }
    },
    touchendFun(e) {
      this.isMove = false;
      if (this.curW < this.maxWidth) {
        this.curW = this.currentPos.x = 0;
      }
    },

    getCurrentPosition(event) {
      var xPos, yPos, rect;
      rect = document.getElementById("drag").getBoundingClientRect();
      //event = event.originalEvent;
      //判断是touch，还是鼠标事件
      if (event.type.indexOf("touch") !== -1) {
        xPos = event.touches[0].clientX - rect.left;
        yPos = event.touches[0].clientY - rect.top;
      } else {
        //鼠标事件
        xPos = event.clientX - rect.left;
        yPos = event.clientY - rect.top;
      }
      return {
        x: xPos,
        y: yPos
      };
    },
    getMaxWidth() {
      this.maxWidth =
        document.querySelector("#drag").clientWidth -
        document.querySelector("#"+this.markId).scrollWidth;
    }
  }
};
</script>

<style scoped>
.drag_box{
  padding: 0 2rem;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
#drag {
  position: relative;
  background-color: #e8e8e8;
  width: 100%;
  height: 42px;
  line-height: 42px;
  text-align: center;
  border-radius: 4px;
}
#drag .drag_bg {
  background: #7ac23c;
  height: 42px;
  width: 0;
  border-radius: 4px 0 0 4px;
  
}
#drag .drag_text {
  position: absolute;
  top: 0px;
  width: 100%;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  -o-user-select: none;
  -ms-user-select: none;
}
.drag_text.whitecolor {
  color: #fff;
}
#drag .handler {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 40px;
  height: 40px;
  border: 1px solid #ccc;
  cursor: move;
}
.handler_bg {
  background: #fff
  url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTEyNTVEMURGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTEyNTVEMUNGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MTc5NzNmZS02OTQxLTQyOTYtYTIwNi02NDI2YTNkOWU5YmUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+YiRG4AAAALFJREFUeNpi/P//PwMlgImBQkA9A+bOnfsIiBOxKcInh+yCaCDuByoswaIOpxwjciACFegBqZ1AvBSIS5OTk/8TkmNEjwWgQiUgtQuIjwAxUF3yX3xyGIEIFLwHpKyAWB+I1xGSwxULIGf9A7mQkBwTlhBXAFLHgPgqEAcTkmNCU6AL9d8WII4HOvk3ITkWJAXWUMlOoGQHmsE45ViQ2KuBuASoYC4Wf+OUYxz6mQkgwAAN9mIrUReCXgAAAABJRU5ErkJggg==")
  no-repeat center;
  border-radius: 4px; 
}
.handler_ok_bg {
  background: #fff
  url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDlBRDI3NjVGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDlBRDI3NjRGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphNWEzMWNhMC1hYmViLTQxNWEtYTEwZS04Y2U5NzRlN2Q4YTEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+k+sHwwAAASZJREFUeNpi/P//PwMyKD8uZw+kUoDYEYgloMIvgHg/EM/ptHx0EFk9I8wAoEZ+IDUPiIMY8IN1QJwENOgj3ACo5gNAbMBAHLgAxA4gQ5igAnNJ0MwAVTsX7IKyY7L2UNuJAf+AmAmJ78AEDTBiwGYg5gbifCSxFCZoaBMCy4A4GOjnH0D6DpK4IxNSVIHAfSDOAeLraJrjgJp/AwPbHMhejiQnwYRmUzNQ4VQgDQqXK0ia/0I17wJiPmQNTNBEAgMlQIWiQA2vgWw7QppBekGxsAjIiEUSBNnsBDWEAY9mEFgMMgBk00E0iZtA7AHEctDQ58MRuA6wlLgGFMoMpIG1QFeGwAIxGZo8GUhIysmwQGSAZgwHaEZhICIzOaBkJkqyM0CAAQDGx279Jf50AAAAAABJRU5ErkJggg==")
  no-repeat center;
  border-radius: 0 4px 4px 0;
}
</style>