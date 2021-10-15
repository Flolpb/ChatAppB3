export default ({ app, redirect }) => {
    const cookieRes = app.$cookies.get('uid');
    if (!cookieRes) {
        return redirect('/auth');
    }
}
