import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/header/header';
import Home from './components/home/home';
import Review from './components/review/review';
import Footer from './components/footer/footer';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import './App.css';

class App extends Component {
  
  reviews = [
    {
      id: "0",
      image: "the-da-vinci-code.jpg",
      title: "The Da Vinci Code",
      author: "Dan Brown",
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquam nulla facilisi cras fermentum odio eu feugiat. Nullam non nisi est sit amet. Consequat interdum varius sit amet mattis vulputate enim nulla. Ac ut consequat semper viverra nam libero justo. Vitae purus faucibus ornare suspendisse sed nisi lacus. Erat imperdiet sed euismod nisi porta. Magna sit amet purus gravida quis. Ornare suspendisse sed nisi lacus. Justo laoreet sit amet cursus sit.

      Feugiat pretium nibh ipsum consequat nisl. Mauris nunc congue nisi vitae. Nulla pellentesque dignissim enim sit amet venenatis urna. At lectus urna duis convallis convallis. Neque ornare aenean euismod elementum nisi quis eleifend quam adipiscing. Quam elementum pulvinar etiam non quam lacus. Donec adipiscing tristique risus nec feugiat in fermentum posuere urna. Libero nunc consequat interdum varius sit amet mattis vulputate enim. Pellentesque diam volutpat commodo sed egestas egestas. Diam sollicitudin tempor id eu. Cras pulvinar mattis nunc sed blandit libero volutpat sed. Dolor sit amet consectetur adipiscing elit duis tristique. Non diam phasellus vestibulum lorem sed. Neque laoreet suspendisse interdum consectetur libero id faucibus. Donec pretium vulputate sapien nec sagittis aliquam. Lobortis elementum nibh tellus molestie nunc non blandit massa enim. Vitae turpis massa sed elementum tempus egestas sed.
      
      Turpis egestas integer eget aliquet. Nunc sed augue lacus viverra vitae congue eu consequat. Tortor posuere ac ut consequat semper viverra nam. Consectetur purus ut faucibus pulvinar elementum. Tellus elementum sagittis vitae et leo. Aliquam sem et tortor consequat id porta. Justo laoreet sit amet cursus. Vitae aliquet nec ullamcorper sit amet risus nullam. Dictum varius duis at consectetur lorem donec massa. Laoreet suspendisse interdum consectetur libero id faucibus nisl tincidunt eget.
      
      Sollicitudin aliquam ultrices sagittis orci a scelerisque. Malesuada fames ac turpis egestas sed tempus urna et. A diam maecenas sed enim ut. Velit euismod in pellentesque massa placerat duis. Eget est lorem ipsum dolor sit amet consectetur adipiscing. Phasellus egestas tellus rutrum tellus pellentesque eu. Id ornare arcu odio ut sem nulla. Vitae ultricies leo integer malesuada nunc vel risus. Massa eget egestas purus viverra accumsan in. Id velit ut tortor pretium. Augue interdum velit euismod in pellentesque massa.
      
      In ornare quam viverra orci sagittis eu. Sed euismod nisi porta lorem mollis aliquam ut porttitor leo. Tortor dignissim convallis aenean et tortor at risus viverra. Velit sed ullamcorper morbi tincidunt ornare massa eget egestas purus. Aliquam vestibulum morbi blandit cursus. Cum sociis natoque penatibus et. Tortor aliquam nulla facilisi cras fermentum odio eu. Ullamcorper velit sed ullamcorper morbi tincidunt. Dis parturient montes nascetur ridiculus mus. Gravida in fermentum et sollicitudin ac orci phasellus egestas tellus. Venenatis urna cursus eget nunc scelerisque viverra. Nunc sed augue lacus viverra vitae. Nunc mattis enim ut tellus elementum sagittis vitae. Maecenas volutpat blandit aliquam etiam erat velit scelerisque. Pulvinar elementum integer enim neque. Eu facilisis sed odio morbi. Cursus eget nunc scelerisque viverra. Ut morbi tincidunt augue interdum. Duis at consectetur lorem donec massa sapien. Dolor sed viverra ipsum nunc aliquet bibendum enim facilisis.`,
      createdOn: "15-01-2019"
    },
    {
      id: "1",
      image: "the-da-vinci-code.jpg",
      title: "Angels and Demons",
      author: "Dan Brown",
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sit amet commodo nulla facilisi nullam vehicula ipsum a arcu. Egestas tellus rutrum tellus pellentesque eu. Lobortis scelerisque fermentum dui faucibus. Faucibus scelerisque eleifend donec pretium vulputate sapien. Enim facilisis gravida neque convallis a cras semper. Adipiscing bibendum est ultricies integer quis. Neque gravida in fermentum et sollicitudin ac orci phasellus. Nulla at volutpat diam ut venenatis tellus in metus. Ultrices in iaculis nunc sed augue. Neque aliquam vestibulum morbi blandit cursus risus at ultrices. Scelerisque eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada. Montes nascetur ridiculus mus mauris vitae ultricies leo integer.

      Lectus quam id leo in vitae turpis. Mauris cursus mattis molestie a iaculis at. Imperdiet dui accumsan sit amet nulla facilisi morbi tempus. Phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec. Elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi. Sodales neque sodales ut etiam sit amet nisl. Scelerisque in dictum non consectetur a. Volutpat diam ut venenatis tellus in metus vulputate. Vestibulum lectus mauris ultrices eros in cursus. Sed risus ultricies tristique nulla aliquet enim tortor at auctor.
      
      Vitae purus faucibus ornare suspendisse. Fermentum et sollicitudin ac orci. In nisl nisi scelerisque eu ultrices. Purus ut faucibus pulvinar elementum integer enim neque. Placerat in egestas erat imperdiet sed euismod nisi porta. Viverra justo nec ultrices dui sapien eget mi. Quis risus sed vulputate odio ut enim blandit. Sit amet massa vitae tortor condimentum lacinia. Et malesuada fames ac turpis egestas. Tincidunt tortor aliquam nulla facilisi cras fermentum. Aenean pharetra magna ac placerat vestibulum. Amet facilisis magna etiam tempor orci eu lobortis elementum nibh. Ut etiam sit amet nisl purus in mollis nunc sed. Sed tempus urna et pharetra pharetra massa. Morbi tristique senectus et netus et malesuada fames. Volutpat est velit egestas dui. Egestas purus viverra accumsan in nisl nisi scelerisque eu ultrices. Cursus turpis massa tincidunt dui ut ornare.
      
      Felis bibendum ut tristique et egestas. Ac tortor vitae purus faucibus ornare suspendisse sed. Sociis natoque penatibus et magnis. Velit euismod in pellentesque massa placerat duis. Etiam sit amet nisl purus in mollis nunc sed. Ridiculus mus mauris vitae ultricies leo integer malesuada nunc vel. Congue quisque egestas diam in arcu cursus. In cursus turpis massa tincidunt dui ut ornare. Massa sed elementum tempus egestas sed sed. Tincidunt eget nullam non nisi est sit amet facilisis magna. Tristique sollicitudin nibh sit amet commodo. Odio facilisis mauris sit amet massa vitae tortor. Viverra vitae congue eu consequat ac felis donec et.
      
      Gravida quis blandit turpis cursus in hac habitasse platea. A condimentum vitae sapien pellentesque habitant morbi tristique. Lorem dolor sed viverra ipsum nunc aliquet bibendum. Interdum velit euismod in pellentesque massa placerat duis. Arcu non odio euismod lacinia at quis. Quam elementum pulvinar etiam non quam lacus suspendisse faucibus interdum. Non curabitur gravida arcu ac tortor dignissim. Aliquam etiam erat velit scelerisque in dictum. Mattis rhoncus urna neque viverra justo nec ultrices dui sapien. Mollis nunc sed id semper risus in hendrerit gravida. Tincidunt nunc pulvinar sapien et. Felis imperdiet proin fermentum leo vel orci porta non. Interdum varius sit amet mattis vulputate enim.`,
      createdOn: "30-01-2019"
    },
    {
      id: "2",
      image: "the-da-vinci-code.jpg",
      title: "Harry Potter",
      author: "J.K Rowling",
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sit amet commodo nulla facilisi nullam vehicula ipsum a arcu. Egestas tellus rutrum tellus pellentesque eu. Lobortis scelerisque fermentum dui faucibus. Faucibus scelerisque eleifend donec pretium vulputate sapien. Enim facilisis gravida neque convallis a cras semper. Adipiscing bibendum est ultricies integer quis. Neque gravida in fermentum et sollicitudin ac orci phasellus. Nulla at volutpat diam ut venenatis tellus in metus. Ultrices in iaculis nunc sed augue. Neque aliquam vestibulum morbi blandit cursus risus at ultrices. Scelerisque eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada. Montes nascetur ridiculus mus mauris vitae ultricies leo integer.

      Lectus quam id leo in vitae turpis. Mauris cursus mattis molestie a iaculis at. Imperdiet dui accumsan sit amet nulla facilisi morbi tempus. Phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec. Elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi. Sodales neque sodales ut etiam sit amet nisl. Scelerisque in dictum non consectetur a. Volutpat diam ut venenatis tellus in metus vulputate. Vestibulum lectus mauris ultrices eros in cursus. Sed risus ultricies tristique nulla aliquet enim tortor at auctor.
      
      Vitae purus faucibus ornare suspendisse. Fermentum et sollicitudin ac orci. In nisl nisi scelerisque eu ultrices. Purus ut faucibus pulvinar elementum integer enim neque. Placerat in egestas erat imperdiet sed euismod nisi porta. Viverra justo nec ultrices dui sapien eget mi. Quis risus sed vulputate odio ut enim blandit. Sit amet massa vitae tortor condimentum lacinia. Et malesuada fames ac turpis egestas. Tincidunt tortor aliquam nulla facilisi cras fermentum. Aenean pharetra magna ac placerat vestibulum. Amet facilisis magna etiam tempor orci eu lobortis elementum nibh. Ut etiam sit amet nisl purus in mollis nunc sed. Sed tempus urna et pharetra pharetra massa. Morbi tristique senectus et netus et malesuada fames. Volutpat est velit egestas dui. Egestas purus viverra accumsan in nisl nisi scelerisque eu ultrices. Cursus turpis massa tincidunt dui ut ornare.
      
      Felis bibendum ut tristique et egestas. Ac tortor vitae purus faucibus ornare suspendisse sed. Sociis natoque penatibus et magnis. Velit euismod in pellentesque massa placerat duis. Etiam sit amet nisl purus in mollis nunc sed. Ridiculus mus mauris vitae ultricies leo integer malesuada nunc vel. Congue quisque egestas diam in arcu cursus. In cursus turpis massa tincidunt dui ut ornare. Massa sed elementum tempus egestas sed sed. Tincidunt eget nullam non nisi est sit amet facilisis magna. Tristique sollicitudin nibh sit amet commodo. Odio facilisis mauris sit amet massa vitae tortor. Viverra vitae congue eu consequat ac felis donec et.
      
      Gravida quis blandit turpis cursus in hac habitasse platea. A condimentum vitae sapien pellentesque habitant morbi tristique. Lorem dolor sed viverra ipsum nunc aliquet bibendum. Interdum velit euismod in pellentesque massa placerat duis. Arcu non odio euismod lacinia at quis. Quam elementum pulvinar etiam non quam lacus suspendisse faucibus interdum. Non curabitur gravida arcu ac tortor dignissim. Aliquam etiam erat velit scelerisque in dictum. Mattis rhoncus urna neque viverra justo nec ultrices dui sapien. Mollis nunc sed id semper risus in hendrerit gravida. Tincidunt nunc pulvinar sapien et. Felis imperdiet proin fermentum leo vel orci porta non. Interdum varius sit amet mattis vulputate enim.`,
      createdOn: "15-02-2019"
    },
    {
      id: "3",
      image: "the-da-vinci-code.jpg",
      title: "Harry Potter",
      author: "J.K Rowling",
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sit amet commodo nulla facilisi nullam vehicula ipsum a arcu. Egestas tellus rutrum tellus pellentesque eu. Lobortis scelerisque fermentum dui faucibus. Faucibus scelerisque eleifend donec pretium vulputate sapien. Enim facilisis gravida neque convallis a cras semper. Adipiscing bibendum est ultricies integer quis. Neque gravida in fermentum et sollicitudin ac orci phasellus. Nulla at volutpat diam ut venenatis tellus in metus. Ultrices in iaculis nunc sed augue. Neque aliquam vestibulum morbi blandit cursus risus at ultrices. Scelerisque eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada. Montes nascetur ridiculus mus mauris vitae ultricies leo integer.

      Lectus quam id leo in vitae turpis. Mauris cursus mattis molestie a iaculis at. Imperdiet dui accumsan sit amet nulla facilisi morbi tempus. Phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec. Elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi. Sodales neque sodales ut etiam sit amet nisl. Scelerisque in dictum non consectetur a. Volutpat diam ut venenatis tellus in metus vulputate. Vestibulum lectus mauris ultrices eros in cursus. Sed risus ultricies tristique nulla aliquet enim tortor at auctor.
      
      Vitae purus faucibus ornare suspendisse. Fermentum et sollicitudin ac orci. In nisl nisi scelerisque eu ultrices. Purus ut faucibus pulvinar elementum integer enim neque. Placerat in egestas erat imperdiet sed euismod nisi porta. Viverra justo nec ultrices dui sapien eget mi. Quis risus sed vulputate odio ut enim blandit. Sit amet massa vitae tortor condimentum lacinia. Et malesuada fames ac turpis egestas. Tincidunt tortor aliquam nulla facilisi cras fermentum. Aenean pharetra magna ac placerat vestibulum. Amet facilisis magna etiam tempor orci eu lobortis elementum nibh. Ut etiam sit amet nisl purus in mollis nunc sed. Sed tempus urna et pharetra pharetra massa. Morbi tristique senectus et netus et malesuada fames. Volutpat est velit egestas dui. Egestas purus viverra accumsan in nisl nisi scelerisque eu ultrices. Cursus turpis massa tincidunt dui ut ornare.
      
      Felis bibendum ut tristique et egestas. Ac tortor vitae purus faucibus ornare suspendisse sed. Sociis natoque penatibus et magnis. Velit euismod in pellentesque massa placerat duis. Etiam sit amet nisl purus in mollis nunc sed. Ridiculus mus mauris vitae ultricies leo integer malesuada nunc vel. Congue quisque egestas diam in arcu cursus. In cursus turpis massa tincidunt dui ut ornare. Massa sed elementum tempus egestas sed sed. Tincidunt eget nullam non nisi est sit amet facilisis magna. Tristique sollicitudin nibh sit amet commodo. Odio facilisis mauris sit amet massa vitae tortor. Viverra vitae congue eu consequat ac felis donec et.
      
      Gravida quis blandit turpis cursus in hac habitasse platea. A condimentum vitae sapien pellentesque habitant morbi tristique. Lorem dolor sed viverra ipsum nunc aliquet bibendum. Interdum velit euismod in pellentesque massa placerat duis. Arcu non odio euismod lacinia at quis. Quam elementum pulvinar etiam non quam lacus suspendisse faucibus interdum. Non curabitur gravida arcu ac tortor dignissim. Aliquam etiam erat velit scelerisque in dictum. Mattis rhoncus urna neque viverra justo nec ultrices dui sapien. Mollis nunc sed id semper risus in hendrerit gravida. Tincidunt nunc pulvinar sapien et. Felis imperdiet proin fermentum leo vel orci porta non. Interdum varius sit amet mattis vulputate enim.`,
      createdOn: "15-02-2019"
    },
    {
      id: "4",
      image: "the-da-vinci-code.jpg",
      title: "Harry Potter",
      author: "J.K Rowling",
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sit amet commodo nulla facilisi nullam vehicula ipsum a arcu. Egestas tellus rutrum tellus pellentesque eu. Lobortis scelerisque fermentum dui faucibus. Faucibus scelerisque eleifend donec pretium vulputate sapien. Enim facilisis gravida neque convallis a cras semper. Adipiscing bibendum est ultricies integer quis. Neque gravida in fermentum et sollicitudin ac orci phasellus. Nulla at volutpat diam ut venenatis tellus in metus. Ultrices in iaculis nunc sed augue. Neque aliquam vestibulum morbi blandit cursus risus at ultrices. Scelerisque eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada. Montes nascetur ridiculus mus mauris vitae ultricies leo integer.

      Lectus quam id leo in vitae turpis. Mauris cursus mattis molestie a iaculis at. Imperdiet dui accumsan sit amet nulla facilisi morbi tempus. Phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec. Elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi. Sodales neque sodales ut etiam sit amet nisl. Scelerisque in dictum non consectetur a. Volutpat diam ut venenatis tellus in metus vulputate. Vestibulum lectus mauris ultrices eros in cursus. Sed risus ultricies tristique nulla aliquet enim tortor at auctor.
      
      Vitae purus faucibus ornare suspendisse. Fermentum et sollicitudin ac orci. In nisl nisi scelerisque eu ultrices. Purus ut faucibus pulvinar elementum integer enim neque. Placerat in egestas erat imperdiet sed euismod nisi porta. Viverra justo nec ultrices dui sapien eget mi. Quis risus sed vulputate odio ut enim blandit. Sit amet massa vitae tortor condimentum lacinia. Et malesuada fames ac turpis egestas. Tincidunt tortor aliquam nulla facilisi cras fermentum. Aenean pharetra magna ac placerat vestibulum. Amet facilisis magna etiam tempor orci eu lobortis elementum nibh. Ut etiam sit amet nisl purus in mollis nunc sed. Sed tempus urna et pharetra pharetra massa. Morbi tristique senectus et netus et malesuada fames. Volutpat est velit egestas dui. Egestas purus viverra accumsan in nisl nisi scelerisque eu ultrices. Cursus turpis massa tincidunt dui ut ornare.
      
      Felis bibendum ut tristique et egestas. Ac tortor vitae purus faucibus ornare suspendisse sed. Sociis natoque penatibus et magnis. Velit euismod in pellentesque massa placerat duis. Etiam sit amet nisl purus in mollis nunc sed. Ridiculus mus mauris vitae ultricies leo integer malesuada nunc vel. Congue quisque egestas diam in arcu cursus. In cursus turpis massa tincidunt dui ut ornare. Massa sed elementum tempus egestas sed sed. Tincidunt eget nullam non nisi est sit amet facilisis magna. Tristique sollicitudin nibh sit amet commodo. Odio facilisis mauris sit amet massa vitae tortor. Viverra vitae congue eu consequat ac felis donec et.
      
      Gravida quis blandit turpis cursus in hac habitasse platea. A condimentum vitae sapien pellentesque habitant morbi tristique. Lorem dolor sed viverra ipsum nunc aliquet bibendum. Interdum velit euismod in pellentesque massa placerat duis. Arcu non odio euismod lacinia at quis. Quam elementum pulvinar etiam non quam lacus suspendisse faucibus interdum. Non curabitur gravida arcu ac tortor dignissim. Aliquam etiam erat velit scelerisque in dictum. Mattis rhoncus urna neque viverra justo nec ultrices dui sapien. Mollis nunc sed id semper risus in hendrerit gravida. Tincidunt nunc pulvinar sapien et. Felis imperdiet proin fermentum leo vel orci porta non. Interdum varius sit amet mattis vulputate enim.`,
      createdOn: "15-02-2019"
    },
    {
      id: "5",
      image: "the-da-vinci-code.jpg",
      title: "Harry Potter",
      author: "J.K Rowling",
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sit amet commodo nulla facilisi nullam vehicula ipsum a arcu. Egestas tellus rutrum tellus pellentesque eu. Lobortis scelerisque fermentum dui faucibus. Faucibus scelerisque eleifend donec pretium vulputate sapien. Enim facilisis gravida neque convallis a cras semper. Adipiscing bibendum est ultricies integer quis. Neque gravida in fermentum et sollicitudin ac orci phasellus. Nulla at volutpat diam ut venenatis tellus in metus. Ultrices in iaculis nunc sed augue. Neque aliquam vestibulum morbi blandit cursus risus at ultrices. Scelerisque eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada. Montes nascetur ridiculus mus mauris vitae ultricies leo integer.

      Lectus quam id leo in vitae turpis. Mauris cursus mattis molestie a iaculis at. Imperdiet dui accumsan sit amet nulla facilisi morbi tempus. Phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec. Elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi. Sodales neque sodales ut etiam sit amet nisl. Scelerisque in dictum non consectetur a. Volutpat diam ut venenatis tellus in metus vulputate. Vestibulum lectus mauris ultrices eros in cursus. Sed risus ultricies tristique nulla aliquet enim tortor at auctor.
      
      Vitae purus faucibus ornare suspendisse. Fermentum et sollicitudin ac orci. In nisl nisi scelerisque eu ultrices. Purus ut faucibus pulvinar elementum integer enim neque. Placerat in egestas erat imperdiet sed euismod nisi porta. Viverra justo nec ultrices dui sapien eget mi. Quis risus sed vulputate odio ut enim blandit. Sit amet massa vitae tortor condimentum lacinia. Et malesuada fames ac turpis egestas. Tincidunt tortor aliquam nulla facilisi cras fermentum. Aenean pharetra magna ac placerat vestibulum. Amet facilisis magna etiam tempor orci eu lobortis elementum nibh. Ut etiam sit amet nisl purus in mollis nunc sed. Sed tempus urna et pharetra pharetra massa. Morbi tristique senectus et netus et malesuada fames. Volutpat est velit egestas dui. Egestas purus viverra accumsan in nisl nisi scelerisque eu ultrices. Cursus turpis massa tincidunt dui ut ornare.
      
      Felis bibendum ut tristique et egestas. Ac tortor vitae purus faucibus ornare suspendisse sed. Sociis natoque penatibus et magnis. Velit euismod in pellentesque massa placerat duis. Etiam sit amet nisl purus in mollis nunc sed. Ridiculus mus mauris vitae ultricies leo integer malesuada nunc vel. Congue quisque egestas diam in arcu cursus. In cursus turpis massa tincidunt dui ut ornare. Massa sed elementum tempus egestas sed sed. Tincidunt eget nullam non nisi est sit amet facilisis magna. Tristique sollicitudin nibh sit amet commodo. Odio facilisis mauris sit amet massa vitae tortor. Viverra vitae congue eu consequat ac felis donec et.
      
      Gravida quis blandit turpis cursus in hac habitasse platea. A condimentum vitae sapien pellentesque habitant morbi tristique. Lorem dolor sed viverra ipsum nunc aliquet bibendum. Interdum velit euismod in pellentesque massa placerat duis. Arcu non odio euismod lacinia at quis. Quam elementum pulvinar etiam non quam lacus suspendisse faucibus interdum. Non curabitur gravida arcu ac tortor dignissim. Aliquam etiam erat velit scelerisque in dictum. Mattis rhoncus urna neque viverra justo nec ultrices dui sapien. Mollis nunc sed id semper risus in hendrerit gravida. Tincidunt nunc pulvinar sapien et. Felis imperdiet proin fermentum leo vel orci porta non. Interdum varius sit amet mattis vulputate enim.`,
      createdOn: "15-02-2019"
    },
    {
      id: "6",
      image: "the-da-vinci-code.jpg",
      title: "Harry Potter",
      author: "J.K Rowling",
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sit amet commodo nulla facilisi nullam vehicula ipsum a arcu. Egestas tellus rutrum tellus pellentesque eu. Lobortis scelerisque fermentum dui faucibus. Faucibus scelerisque eleifend donec pretium vulputate sapien. Enim facilisis gravida neque convallis a cras semper. Adipiscing bibendum est ultricies integer quis. Neque gravida in fermentum et sollicitudin ac orci phasellus. Nulla at volutpat diam ut venenatis tellus in metus. Ultrices in iaculis nunc sed augue. Neque aliquam vestibulum morbi blandit cursus risus at ultrices. Scelerisque eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada. Montes nascetur ridiculus mus mauris vitae ultricies leo integer.

      Lectus quam id leo in vitae turpis. Mauris cursus mattis molestie a iaculis at. Imperdiet dui accumsan sit amet nulla facilisi morbi tempus. Phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec. Elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi. Sodales neque sodales ut etiam sit amet nisl. Scelerisque in dictum non consectetur a. Volutpat diam ut venenatis tellus in metus vulputate. Vestibulum lectus mauris ultrices eros in cursus. Sed risus ultricies tristique nulla aliquet enim tortor at auctor.
      
      Vitae purus faucibus ornare suspendisse. Fermentum et sollicitudin ac orci. In nisl nisi scelerisque eu ultrices. Purus ut faucibus pulvinar elementum integer enim neque. Placerat in egestas erat imperdiet sed euismod nisi porta. Viverra justo nec ultrices dui sapien eget mi. Quis risus sed vulputate odio ut enim blandit. Sit amet massa vitae tortor condimentum lacinia. Et malesuada fames ac turpis egestas. Tincidunt tortor aliquam nulla facilisi cras fermentum. Aenean pharetra magna ac placerat vestibulum. Amet facilisis magna etiam tempor orci eu lobortis elementum nibh. Ut etiam sit amet nisl purus in mollis nunc sed. Sed tempus urna et pharetra pharetra massa. Morbi tristique senectus et netus et malesuada fames. Volutpat est velit egestas dui. Egestas purus viverra accumsan in nisl nisi scelerisque eu ultrices. Cursus turpis massa tincidunt dui ut ornare.
      
      Felis bibendum ut tristique et egestas. Ac tortor vitae purus faucibus ornare suspendisse sed. Sociis natoque penatibus et magnis. Velit euismod in pellentesque massa placerat duis. Etiam sit amet nisl purus in mollis nunc sed. Ridiculus mus mauris vitae ultricies leo integer malesuada nunc vel. Congue quisque egestas diam in arcu cursus. In cursus turpis massa tincidunt dui ut ornare. Massa sed elementum tempus egestas sed sed. Tincidunt eget nullam non nisi est sit amet facilisis magna. Tristique sollicitudin nibh sit amet commodo. Odio facilisis mauris sit amet massa vitae tortor. Viverra vitae congue eu consequat ac felis donec et.
      
      Gravida quis blandit turpis cursus in hac habitasse platea. A condimentum vitae sapien pellentesque habitant morbi tristique. Lorem dolor sed viverra ipsum nunc aliquet bibendum. Interdum velit euismod in pellentesque massa placerat duis. Arcu non odio euismod lacinia at quis. Quam elementum pulvinar etiam non quam lacus suspendisse faucibus interdum. Non curabitur gravida arcu ac tortor dignissim. Aliquam etiam erat velit scelerisque in dictum. Mattis rhoncus urna neque viverra justo nec ultrices dui sapien. Mollis nunc sed id semper risus in hendrerit gravida. Tincidunt nunc pulvinar sapien et. Felis imperdiet proin fermentum leo vel orci porta non. Interdum varius sit amet mattis vulputate enim.`,
      createdOn: "15-02-2019"
    }
  ];

  componentDidMount(){
    //grab reviews from API
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Header />

          <Route exact={true} path="/" render={() => (
            <Home reviews={this.reviews} totalReviews={25} />
          )} />

          <Route path="/review/:reviewId" render={({match}) => (
            <Review review={ this.reviews.find(r => r.id === match.params.reviewId )} />
          )} />

          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;