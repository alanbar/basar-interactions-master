<script>
    import axios from 'axios'
    
    let disabled = true
    let username, email, password, passwordRepeat

    
    // const onChangePasswordRepeat = (event) => {
    //     passwordRepeat = event.target.value
    //     refreshDisabled()
    // }
    // const refreshDisabled = () => {

    $: disabled = (password && passwordRepeat) ? password !== passwordRepeat : true
        //disabled = password !== passwordRepeat
        // if(password === passwordRepeat){
        //     disabled = false
        // } else {
        //     disabled = true
        // }
    // }
    let apiProgress = false

    let signUpSuccess = false
    
    const submit = () => {
       disabled = true
       apiProgress = axios.post('/api/1.0/users', { username, email, password})
       apiProgress.then(() => {
         signUpSuccess = true
       }).catch((error) => {
         
       })
    //    fetch('/api/1.0/users', {
    //        method: 'POST',
    //        headers: {
    //            'Content-Type': 'application/json'
    //        },
    //        body: JSON.stringify({ username, email, password }) 
    //     })   
    }                                                                                                                                                                                                                           
    
</script>


<div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
  {#if !signUpSuccess}
    <form class="card mt-5" data-testid="form-sign-up">
      <div class="card-header">
        <h1 class="text-center">Sign Up</h1>
      </div>
      <div class="card-body">
        <div class="form-group"> 
         <label for="username">Username</label>
         <input id="username" class="form-control" bind:value={username}/>
        </div>
        
        <div class="form-group">
        <label for="e-mail">E-mail</label>
        <input id="e-mail" class="form-control" bind:value={email}/>
        </div>
    
        <div class="form-group">
        <label for="password">Password</label>
        <input id="password" type="password" class="form-control" bind:value={password} />
        </div>
    
        <div class="form-group">
        <label for="password-repeat">Password Repeat</label>
        <input id="password-repeat" type="password" class="form-control" bind:value={passwordRepeat}/>
        </div>
    
        <div class="text-center">
        <button class="btn btn-primary" disabled={disabled} on:click|preventDefault={submit}>
           {#await apiProgress} 
            <span class="spinner-border spinner-border-sm" data-testid="spinner"></span>
           {/await} 
          Sign Up</button>
        </div>
       </div>      
    </form>
  {:else}
    <div class="alert alert-success">Please check your e-mail to activate your account</div>
  {/if}     
    </div>