export function actTimerUp (context,val) {
  this.timer = setInterval(() => {
    context.commit("setTimerUp",val)
    val--;
    if (val <= 0) {
      clearInterval(this.timer);
    }
  }, 1000)

}
export function actTimerIn (context,val) {
  this.timer = setInterval(() => {
    context.commit("setTimerIn",val)
    val--;
    if (val <= 0) {
      clearInterval(this.timer);
    }
  }, 1000)

}
