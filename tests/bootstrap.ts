import dbInit from "@db/init"

(async function () {
    console.log('++++++ Bootstraping Tests +++++++')
    await dbInit()
})()
