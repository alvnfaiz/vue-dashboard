// basic init
////////////////////////////////////////////////////////////////////////////////////
const discord_invite ="https://discord.gg/38e4FsMh"; 

// just leave it blank to make it invis.
const socials = {
	facebook:"https://www.facebook.com/teamdivisi",
	github:"#",
	instagram:"#",
	twitter:"#",
	youtube:"#"
}


////////////////////////////////////////////////////////////////////////////////////

// construct header comonent
Vue.component('dashboard-header',{
	template:`
		<nav class="navbar navbar-dark bg-dark shadow-md">
			<a v-if="loaded" class="navbar-brand" href="#">
				<img width="30" height="30" class="d-inline-block align-top" alt="" style="border-radius:50%"
				:src="icon.replace('.gif','.png')"
				>
				{{servername}}
			</a>
		</nav>
	`,
	props:{
		loaded: Boolean,
		servername: String,
		icon: String
	}
});

// construct sekat component
Vue.component('sekat',{
	template:`
		<div class="sekat mx-auto text-secondary">
		*****
		</div>
	`
})

// construct social component
Vue.component('social-item', {
	template:`
		<a :href="url" class="m-1">
			<div class="social-m shadow-anima" style="padding: 6px">
				<i class="fa" :class="ico" style="font-size:26px; margin:auto"></i>
			</div>
		</a>
	`,
	props:{
		ico:String,
		url:String
	}
})

Vue.component('social', {
	template:`
		<div class="d-flex flex-row m-1">
			<social-item v-for="social in social_list"
				:key="social.ico"
				:ico="social.ico"
				:url="social.url"
			></social-item>
		</div>
	`,
	computed:{
		social_list: function(){
			var new_arr = [];
			var social_icon = {
				facebook:"fa-facebook-f",
				github:"fa-github",
				instagram:"fa-instagram",
				twitter:"fa-twitter",
				youtube:"fa-youtube"
			};

			Object.keys(social_icon).map(social => {
				var ico = social_icon[social];
				var url = socials[social];
				if(url) new_arr.push({
					ico,
					url
				})
			});

			return new_arr;
		}
	}
})


// construct about us
Vue.component('dashboard-about', {
	template:`
		<div class="container"
		>
			<div class="row m-2">
				<div class="col-md-2 m-2">
					<div class="display-logo"
						:style="{backgroundImage:'url('+icon+')'}"
					></div>
				</div>
				<div class="col-md-8">
					<span class="display-4  text-light">
						{{servername}}
					</span>
					<social></social>
					<div class="text-light bg-secondary rounded-lg p-1" style="max-width:200px">
						<span class="counter"
						:data-target="membercount" 
						></span> Members
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-12 bg-light rounded-lg p-4 text-center" style="min-height:200px; display:block">
					<h2>About</h2>
					<p class="text-secondary">
						{{description}}
					</p>
					<sekat></sekat>
				</div>
			</div>
		</div>
	`,
	props:{
		icon: String,
		servername: String,
		membercount: Number,
		description: String
	},
	mounted: function(){
			var counters = document.querySelectorAll(".counter");
				counters.forEach(counter => {
					counter.innerText = '0';
					var updateCounter = () =>{
						var target = counter.getAttribute("data-target");
						var n = + counter.innerText;

						var increment = target/500;

						if(n < target){
							counter.innerText = `${Math.ceil(n+increment)}`;

							setTimeout(updateCounter,(increment/8)**2);
						}
					};

					updateCounter()
				})
		}
})

// construct inner-dashboard component
Vue.component(`inner-dashboard`, {
	data: function(){
		return {
			base_url: "https://script.google.com/macros/s/AKfycbwPLixMYbL1m1ROCWMovZ0MgszGrnyYGKR9HAC0AYHCOSbm4og/exec",
			invite_url: discord_invite,
			icon:"",
			serverName:"",
			loaded: false
		}
	},
	template:`
		<div id="inner" class="bg-dark splashes"
			:style="isSplash? { backgroundImage: 'url('+splash+')'} : {}"
		>
			<dashboard-header
				:loaded="loaded"
				:icon="icon"
				:servername="serverName"
			></dashboard-header>
			<dashboard-about v-if="loaded"
				:servername="serverName"
				:icon="icon"
				:membercount="membercount"
				:description="guild.description"
			></dashboard-about>
		</div>
	`,
	props:{
		splash: String
	},
	methods:{
		clearUrl : function(url){
			var list_pattern = [
				"discord.com",
				"discord.gg"
			];

			var new_url ="";

			list_pattern.map(e=>{
				var pattern = new RegExp(`(http(s)?:\/\/)?(www\.)?${e}\/(invite\/)?`)
				if(pattern.test(url)) new_url = url.replace(pattern,"")
			})
			return new_url
		},
		isSplash: function(){
			return this.splash;
		}
	},
	created: function(){
		const cdn_url = "https://cdn.discordapp.com"
		this.code = this.clearUrl(this.invite_url);
		const invite_Api = `${this.base_url}?m=invite&code=${this.code}`;

		fetch(invite_Api)
		.then(r => r.json())
		.then(e => {
			this.loaded = true;
			this.serverName = e.guild.name;
			this.icon = `${cdn_url}/icons/${e.guild.id}/${e.guild.icon}.gif`;
			this.membercount = e.approximate_member_count;

			if(e.guild.splash) this.splash = `${cdn_url}/splashes/${e.guild.id}/${e.guild.splash}.png?size=1280`;

			this.guild = e.guild;

		})

	}
})

// create instance
let vm = new Vue({
	el:"#main-dashboard"
});