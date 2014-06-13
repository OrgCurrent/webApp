describe('home', function(){

  describe('successful login with correct email/password combo', function(){
    browser.get('http://0.0.0.0:9000/login');
    element(by.model('user.email')).sendKeys('test@test.com');
    element(by.model('user.password')).sendKeys('test');
    element(by.css('.form')).submit();
  
    it('should login & redirect to home for valid user', function(){
      browser.getLocationAbsUrl().then(function(url){
        expect(url).toBe('http://0.0.0.0:9000/');
      });
    });

  });

  describe('failed login', function(){});

});
