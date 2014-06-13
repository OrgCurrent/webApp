describe('home', function(){

  it('should login & redirect to home for valid user', function(){
    browser.get('http://0.0.0.0:9000/login');
    element(by.model('user.email')).sendKeys('test@test.com');
    element(by.model('user.password')).sendKeys('test');
    element(by.css('.form')).submit();
    browser.getLocationAbsUrl().then(function(url){
      expect(url).toBe('http://0.0.0.0:9000/');
    });
  });

});
