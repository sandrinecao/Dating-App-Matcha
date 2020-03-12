describe('window.location.origin', function () {
  it('should return the current URL', function () {
    expect(window.location.origin).toEqual("" + window.location.protocol + "//" + window.location.host);
  });
});
