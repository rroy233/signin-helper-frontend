<template>
  <div>
    <div justify="center" align="center" class="mt-12">
      <div>
          <div class="errorheader mb-12">ERROR</div>
          <div class="text-subtitle-1 my-6"><div class="grey--text">错误信息</div>{{$route.params.info}}</div>
      </div>
      <v-btn rounded outlined color="rgba(249, 128, 128, 0.6)" dark href="/">返回主页</v-btn>
      <div class="justify-end"><v-img src="../assets/girls_cry.jpg"></v-img></div>
    </div>
  </div>
</template>

<script>
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Quicksand&display=swap');
.errorheader{
    font-family: 'Quicksand', sans-serif;
    position: relative;
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    font-size: 3rem;
    color: transparent;
    text-shadow:
        0px 0px 1px rgba(249, 128, 128, 0.6),
        0px 4px 4px rgba(254, 159, 159, 0.05);
    letter-spacing: .2rem;
}
</style>