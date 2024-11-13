/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//twZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAiAAAq2wAHBw8PDxYWFh4eHiUlJS0tLTQ0NDw8PENDQ0tLS1JSUlpaWmFhYWlpaXBwcHh4eICAh4eHj4+PlpaWnp6epaWlra2ttLS0vLy8w8PDy8vL0tLS2tra4eHh6enp8PDw+Pj4//8AAAA5TEFNRTMuOTlyAZcAAAAAAAAAABRgJAWqTgAAYAAAKtte/Hs9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7cGQAAAJFJsetJMAAJmGYUKekAAxstW25l4AQyIZsdyDQAgBAAGxW3RAFAQMFwAAABAwuFwBht4OF389+Cd7ER7sgQAAAAAAABBC7uyZMmT17u7/ggFkyZO7u7IECBCDn8EAQOfiAEAwD4PvNN5zkHELEPJe+LeXNRx/SmWMEAwxNG3PykTn6wQWD8uD7///8H0QkHE5LXI7ZbdsAAAAHsf8/XzAIADY2RflgBFBRcZZtMz5bkaazVCq6AmgCcoQUmryE+DlDKyek8Sl+e6EvUfBm8besQ7IpIwFiNiNm3prf+m2LNeFBkzb49779P8QLVinIiVQOBweVycHZABrRAAAAGrBgl5aoFsra41xBPrDwg1Izn3pyHUfix0+m//kFBi4usPW+tQAgIU5LZcAAYOBJZUwEIjj/+3JkCAATFx/Wb3MADCdhmdXsDAAMOHM9TXdgMI+OKHQwsL9gLMKAFIkSCMbaUFgunlk0dphaZeRdOlpotKo0BSJAy3K1Klgi9cgtWrsRS9YKy2zLZleKbFHhZqxFwZNVpaW9S2fx5/K1oRQVcoGg7h2VBXBUNCQYBaRbIADZmrI60AwE7SpXaj8IkcFSeCoeCxsgIUetpCixrGSxKsABAnrA0ShhIBMJhngxzHgpoLEYENhcGGA8tSbJbG/gCSKunBlSIZmYs7cveWWV0O6rcv/CjLlVZRbw4o8iyHCTXVKo+0BFNlUn7WlzIXFyz5Krkav//0//vd9X/9v//ffqABJRlNmgVAJxMeRpmqo1qDlB6zxypZ6ct29RxPEubPbetbrKAC/AAGagB1x4YTKEkmmIhvhzGMpmAP/7cGQLCBK9Fcszf+gMI4IJbSWCYQ2ASxsv+4LAfYUkKMElRDxjCDJiQHBh6H5mbcBkMJQJAVmEEsCBgcmVwBIwvo/LqzYEB92cN61HUDbE9lrTxSGmxzvWpoKElgDX7lf//X/RUAFEtIFPQAAJLrI4zbmXAVHvSmEyCOjzoHF25SidOSIBpj/0AFfAoGCgA6ZgoofwYV4zHmrhMoxmBH1mHaN4YMghJgSiaGEeE4Zu6YJoFBMmEuBkYyCZgkEBYHmCkQcAcpgYFIAAcPkR3oBQAKB1Jr9nFqiZ8u7+PxLE4XJNHhcq3M///yf/693/sPEv//jVgABEpAFkA9ks4GRaoeicveqCeF0K+jTN412QarPigHoANwAAYJEAbmFFgkpkCBEQfzsYsnAcM0ZVoXJi5BGGI2GWYcj/+3JkEgiS6g9GM/7goCchSPoxiQYMID0bT/dCwIkEo1gwGUAgBkNQonM4uYWJAyEUGi9phk0B8KKBulvKlrRgLixCKrr/67x1pYqhoH3nf/////Z//QzSIP/oYzrAAZJyAAAB8OCqOtEqgxWhNN2Ja4LBNPPHpvaLXtD5JH////////1gEm4QgAYIyDQGCTBw5hTK18al2s4nbe8GbTDmLZyGCh7mNQqnVVvHg4sGNgMmhBAoCXuIZJtcyy4HFgrQL6mTyd5/4y0yrNiipxBzqdUct//81rru/9b8shS3h1n/p33zbbwCoBVVKMAiScFIhgjs9jUtu///////9TqSqVw4fd//v0UAAAlIwwADAuQA4wbYDSMV9GVzqzSOY1exIzHKB6MO8FMwrgajCBCdMQFNQ2KaBpCi4//7cGQZCBLrDEdT/tigKyEI3AAiFAroTxrv9UOAhQGjnAAYACFrQICzjgVUEAUdL7RYTaR2FnHGCOtjyG4RBlnq93/6P0/f9TlsYH//q12gEvAAG/MAm4GhMHYYVUulFSTJKSVeTl3gkYZ6/k//p/T90n1DlnRQO//+gQjRAIBgfQLiYIiGQGE6KHpp0CfUdWYqZlqsYpGGYGmIYmhEcBsycgBWYngQDglRyVKOg8FwjgK8yaD+BNUz/8oTgIgBTkb9MjV///9Ov/9IowQUt//1rAI42GDKPrpUGPlmKAA8vFzyvK2lf//////x7Z5Ac//qkAAAGJLdq3IkJRJ3a+YT4GPGnmCJpz0QBmKFpi8Cxh6DJhIGRiA6YXC9JRJ1pT+w0LBFPxOQ1PqX/fJIstaF0TEntXO/b+7/+3JkIwiClQzJ63/oACdAmMYFJQIKRC8YT/cCwJEB4+gzDAD8v2VNr//scuJWf/9IAXkAAFNYkHrhoDC0grjWJfqD4NdFGxc9r/+7zH5L/7cPNAgjGgA/cAAGCCgvBgkAZaYVOpAGqLqEJ27jhm4rZi2YhgcWZh8AJt0axvKChiAAIdpS1rwwcyEluUVovrewjaWCj5ox//Z2dv///7hyBMCC0LErv/b2bwCFgBAAcIWCsIUDDH2+j4wHGiooGkf//9l////ylz1KWl3/+pUxAAGgW4wbwEGMWfHjzr0yhgxZsFVMHSAjDPEVzKQUDGshzG/ejBUdCEGU3nBhqEg4NZACFH//97y3X//oq9P///99H9ev////+iLLZGQmvK05Qb/+mzqUo0AAAkWlQTZgg/BU9/TYKJeFCf/7cGQ1jYK/UUYT/RFAJKCo4wTDAgjYJxpu/6AAnYIjqDYMAJ74sz//////FWLaJOlzP//chQgGZSQmcs5GEUH/posB9McqTOZYoMYjEeYDj0NCOaOg2CplDBGQhdZ+WZJJ2th27yKASMngA7///////9S3TaRwEFv/31ID5xhpACAk4dCaKHQ4iPbaf7jjRWo42W//fd+Skdn///TTDy4A//9CAAkASAAAAWcBydcmHoCvxu/A5ufmHYabi2ZNBoYyhSYdCYYPPaYNB2VACTdcJ/Z9JK/sx/tKvCYdmiH///////Utz8aCZw7//pAAEYCEl2aYFAIAEFAcQmb1+uLqUqJqyf7/XL/W9Gz/9P+r35z/+hlDLM/jM6KzCBTjI0EM3dMIrCHjAogOcz98MGXwUSHnFIvbCxT/+3JkSokCTAnHU5/oACbAWQ0EQgAJGCUaTv9gUI4CowiXmACpKQz0Mt5ZEPdpFVCUOsPoKHOZ0f10o949X///8+pZZn/9lJpJAAHDS2PAOlE8U7Zt9C2fU1+a0/+j3jVf///RcgMCwj//svoABWj5IAHN85QyjD2xes3kseiP1z/NOBiMnQ5MYAkMORHMA2WMJwwLAAsyhmmvO65NK2P71g8oVe3USVZVXa/6voXV/kPt+0DvHl2f//acgASPWCYJSanFnBtuz9Rbegn1Pav/v3s//+j1/HLpCgSb/+l1yULcpGiCAaIYZqPVGNFYaep1YR8DPmf1UYuLJgEfAoBmfR8UQkeBSzZFZpoPPpTya8xMhgsLJLHVNt5ZCNfRq/3/f+7qxVD2mv//W5IpqAhMNKfT/vaXYSTK5v/7cGRnCNJxCMbLn+gAJoCowhkmAAlAIx1Oe4AAgwEjzBGIAIiLPX7n9v///u/7Klyhf//9NQIFIAAGmD36MwvoTeNeSGLzC9AMowO0BNNyKDRRcyIsFPkxgZVQbrGqUd/6DQ4AmFGSgV3f/9e3///+9YGnWf/+OGgADVfIoBFHCyDwibsK79qsQRW1LCl97f9b9GqipyPq6v/vW/S///KJ0EwjwxjCsGvMb2yw+Ha2THZGiMIgK02tgwjks4eiiU0x4K317uM7z//VOtdWhjyhBAo4D/eV6etO///o/771oigR//9QgbsrQABeHyIQwgSInKezLKOMCLXWjDwePp+me7v/////Tb2//vqrAACStQAMtg04EzjDcRfM2x0dwMNrA+zBFAGA4kzNSHjKzUscRj40qnBVLk7/+3JkgYmCFQfHM3/YFCfAWNkMJgAIqGsab2hFAJ2Bo/SUiACof2MiE8VRiEwpHtar/6q1fv+r9epTBelwqgN/+KaXZMAAdb6ABFgKaHXKelK5uM6WPz6MsYXr2E6P/1//2f9VjaJQMhv//fTBxsGD4FaYTYvhjNT0noxMwY2guJg+hLGulmDVF5ziyikQk03t/jv//sqNY7OwKQc19fE5Mz//1+3//2FetaQsJU//fVpAAIgHF1obILAwQYSVLLT8b5Yu8UUi7VxZKf/3aPd//9/pnE//+1VuMgAAzQEOnjTCUBEA0n4VDMJKAqDAswD06Rw1o0yhYd2mICt0ocjv+dHIveWKGFWYRYW6C3///9P8y1GlwOJGv//6QAQCkrABBgoLPAYsz+1KRgHix8mSCh4bNa3Fv//////7cGShCQJiB8ZLn9gQJ+C42STBFAikVxrvaETAmAFktDEIAPo+hQeCz6v/9F8GgVgakwJja0CHunNSY54uRhCBLm1lGGTl9DaSStqnDCuGvo0sIgoNIiekfDcUo///+h3/04fK3CcODig0R/0+mmutAAIGhA5wx3/Us3WicQaYt1F3/o//T3/75cGBpYeaA402w///SQFRdQAAAKA+gAGeh54lgYVaKUmqgjJxhVIGiYGkAnHjTm4KGbPkFww4ZmcwG9ujqUsqZFSB46hVCP6vp9TP/9mp9TgoKvD0WEBA5/1qq0EH0AAgBGA7wj/+5odZeWEF+9/9n3O4p/6erew6iIEjBcBnDC3f/+XCF1TOCbNJ1Ixjo3zzEiIMaYUUweQgju/MdxJc3+ikFZ0mNZzU7XFGPZR/s7H/+3Jku41CGgdHG3/QECfgSPoMQgAIXB0YTntAQKIAYwgQiAB9Ct+rd/R6EtyQ55IWB9wLrgmT/7XWVbgwDFHNC0Dbv/+n/zjQP///37O+j//H4VclK0ONoYEyL//K+AQoMB2ANjBXwVExJwlCOQaLMTEkAYYwXsCjO8Wjczs0RGIX8xYbSMgOmsmmvzo0+1padbZP/31oe9LyrR7ei1Ouwmb3LpSzSMnTlb1qjZzO711O0ZFGMH7AEH2KIHYc7f/7q9nWVWfucgvFgAQlFB6AQGYsUBBxoea22cSdothADOVFfRiUM/R7LfY/s/11G9F5QTQAMAxN3/oqJiiEGBQgahgaAOKYRaXRGi3llJhJYNkYFcBanJsGUWlgIaaeRSkzYV/5NX3a/Rv0b37fr/2r7+/+mtHZvTN1cv/7cGTbCbJkBsZjf9AQJsBIwgRiAAiQGxkueyBAlIqjFGCM+ND//p8y6aGq4kpTOphzGcqgZA5whD/QsPLNok0DyUABEyh59EtUX/7z/2ZD7I//N/o/7+//0//+run//9P0yOpAYquESJkVFnf+9S8dAAC1oAAMA5AHTAxAMgwrcXHNWVG6jCrwOkwNQBaPKvNwWM6dIUwFBNLlGPb0Ry30c7XS+SXdtUvWu//3+39Gtb+2v/3/vTp+uvWcikKiGWq3cYFcgwg5/jpRKQ4GC6wABtuQAAGDCBiIKGe1q+tyYPjlSyrLfr0+66q5f0/39daTzDLViWVA6U//+aKyhg8BPmFCKwY30gp8LRQGOoKWYQ4Qh6fma0kqZuBMyv4M9LL79fsjo5jJd701rZv/VN9aLXsq+l9qtr//+3Jk9wkDSWLDg/spMjHAWMwEQgALbUMSr+hEwL6koshgiLj7b1Tb5/0efXQu7EHBZox4TNgsd/9scTFB5UAE7E406EGeNU+oP9nTzhIJEVnDQxvi1yrTn+u/+v+xdqRQPrZBIqHxjP7frZKqAAII+AAMAiAFDAkwJ8whQSqNC6FjTCEALYwJ8BFOQeNKPMcOGA6VLgB7Pf9LVIn5XU5ilKiGcikVqOf6vf6/6r16t6+jrp9K0rTT+jNddfU1s5astiog7f+vzi0AVP1AABsFPRvbrXyjCoAYGDIGg2CBjTRq2GCkoVKCiZ1vX++hDq495B4HCwox5pH/V0IGi+UAMtnYz1BTFjb+O1lqkxcw+jBoBhOWgxDV5ARlEptZ7VValrlhJQAHRYQhgRZtz5i+YsmbyDFD3D261//7cGTvCRL2UUVL+hEwLMBYyQRCAArZJRTPZOSAuIFjaBCIAO19j0LutSCzhcy0oFyIKgqRf/22SpoUFAAz1bkAFDMHPBESNXa0Udrp0uUoqgbk2uUaXstXcsj3f7JnaY/qQI4EAZZwocu/6LNLFQACUblADGxM3yQMdVE0+xVEjHPClMIgDo+2TcKMslcywTt2Nq1Re5aqhA8cpRZ6h4CqLjd9dwBKpvNuGJNNa+LslqKhDt2oJirAoGAWAoccaOP/+hr5EmAEGjagBGQEE6ON6N7NjW0TKhiQ7Je22qPnb6abVu/dvi/VY9QirD0XOgZwo//8iwaFxglgAAwbgjTCXEyMaqAs9inoDG+EjMIMHI8tTNQT1ArSFrbUXfbb1TtfVlZbMxrNNZLXTJXZpF1+cuXo1+7PdKv/+3Jk8QgC41FFy/oRIDLgGMYEIgAKuB0XLnsgQMuBIyQzCAD2XY1b+j//XRFHycuhTg7qLQGVx0DCU/L2zjjZ0k46MATfICEHiBwnfq1Wt1xxMcRVY4sFz7VOe1m5z/zdGxH/+GrCqSAhWB1nw6j/+ilZBQAATCm7Y2gCWYMDMEMw6CTjeyK1PkTDOxMxIABwGg5IXxjB3266bv7aVWpxgsOOjEiQRht0VAwUJ9rBWALGmDjDbMa1abf9Kr8kNMrZf//2vWvIAWIBlUViBX///znr808YijIiA7PbAikrvmyPdks+SebL9dKRdZf/bw4N5kTAqbUMMf/6nKyikgAABRG+VAM5SjUKsw/0xDhfSBOFqIyIOTCoSLKuEIgC20VtXLNuUtCjwusPTg1g4PhZGKPWHL6VaLxYqP/7cGTwCBK7B0XLfsgQMsBYyQhhAAv1RxLPZETAvwEjGBMIAHTyBeu5ytL/RwLoFBxEdBoFAGbd/34uZtcgIlD0Sbgdqpii+dR4DJKcEWpAKnuKktku5vQ17+hv5366PRap6RoTFXix3/9HJgGFoABgIgKmDUEUYzqE56LppGMuE6YOwGx5smsQY4rL2YP+I68l+3rvmWR1dWtFUFHW2X6P79N+pHz6//0XbVF6d+lNWmJstXueYjkmQGxLnCAh/5UrDeMU4ALdb1QGAAaHB8LqY0vGOzLlJpAAVArFT2jZj9r3ti62V/1GP2UeidNlhKNLj2q/6VEl9SnpRAwOASzBVCsMQpM04ukhDiijMkjgwsEy0zWUZm1iw3V+zXqvbSVdi+xjI1DCsTKUWf7kan0303P9/v1q427/+3Bk7YASixXH69sQsDiJ2LIUI64KqBsZjfuAALsBouQQjAADF54XEZgJf/y6BdAxpAAQEGFFAZE33rTumnpOHmkg+KPUayFYqMdcyihLDfRrc+W/YxYGbWkQgwSWYBAeCEYH/6y+QdmHj3oAAwBADDBLBrMTg1Q6HD2TEyB4MFUCc4DDLBAQDEHTjB6//ppTnGRTWnZLN3rmqr6Esvfv9PRWb/avZ/9/f69u/7vakrmynV1KEf/+xsaAAyFSgBQID3K2r50KxLry03oiMzqidaQJvLJMusb/XX5rzvl+XU4K9+AWXMiqgonPXqxCramLDx3+zxVzRchGgMDsEwwWgrTEXTSORtIc5GpDJw5MMhIsy15LVxoqKJ16V+21WTKjsd+5qunv/6+pb//v/Zn+vbZlf//+1Nar//tyZPEJAsxQRTPZESA0QCjJDCIACYBvFu9wQsDpAeKIMQwADKqopjrZhZoh/WlCSSfPkgMg2GxUJCJzOxt5i616fp9qLoeznu77jh7MgpEslNeTvrvmPzV35WZxHddf8P35EJ1ZaUjMvJAaB//U29AeWAgFugAACASYHgMBiImFnHKb8cLNpkYQGGQWAgYW3Ye7EvZ/9+/pUzWnc5ET2Zfcqs+7F7//bpTp/7fX/6V//+zc9uqrJKUaGP+vvUtABa+scu+kjKJ5hakKnMV6n0N1hMF2EAOulV/n2dnY3TPFX/f+j/6f//oYtBgZAgmCeEoYfiIJwoH8HBkaZDFxhQGlonJX0/MWZK+uW6v1qq9vat1WU1nzkzOr+l/3XemvX9LKvTN/1S6Xt0W0mPOR2d3ZnKqNgQf//RH/+3Bk8gmSeVFFk9kRID4qKKkUI64J/T8VL3BCwQcoYmRwj2CppFA4BJJIQw9XN3xVVx9X/WlVFnyLPMumEpsGZi+dELzTiyj2dDrVkpIkeZr5tlDyk4u5anCKCzkUvSthR4VJ/fo6jC2A4xUAEKU4yQAC5hw9mFcQ8bABNp1iEZOHgYMQBqCOQ7csfTey/kmMGxook8xzhEPrfvZqZkVoZX/t/3vqF3oM4mKExv//tCPQbJTJKVuUlfKRmiT0QxUMjDLN3pB5EuQWPrlmtJ5/VFod+HhOWxzNRecsss+dOzNd7kSoxnaYomD9BDzUwZAzEz9gtRggMAzGDAAUyoq7Y0UCYZBnVmLLTHtbEndTGKAlrmIw88MPS191S2uRN1PFjobCp02pq38XR9VXintqb9Hu0qXiMfJ6//tyZO0JAlVQxZPcELApoBk9BCIAClFBFM9wQsEWJ2JUgI54f/2WrYYoRi4SB9DUXT06pe/J6HNuSL1kVf/z75qky7RQGUpP72pnbSlzhf+bzz087DYFOpJKQUBFDgQB48/R6LWiqQVATiQuEAC4ApgUAlGGaUSbb5cB5KqZgLGGgZaBIth7+S8mv///VaevOpnu1HnX391/37LdHehkRrPbMn/3/m/Yr7v502axyFlQhChnf/KHi+gAEZGpACVHw4i7Uq1ttmNbp+VZXbPwANlcR5uIK2mdj5qfmNKjWuDgkfqT+MvQyzOsgsFKt26eg+FQLM/00Qi88QWFqAAMBoCMwMQXDCwLdNgoqY7ZXMpFjBgFMKHYCjMubT/ov7+bkb2K6+Y7Hd90/t+3+2idHX6WZm7elv/fXtr/+3Bk8YDSJwZG0z7YAEoqOHAMI34IOBkhrPdAAQymYkRwjjjWQK7xYWcs8Y/9Cb455MAMQBocRgdQQtz2bTXnUp/0N5U/YyNYiGO3MCPyzfUTCiTykfJjUWj2/kVdubutKq5jPVUnbazkMFFIgYn39CWvYkcJiY8ALUAAIARoYZhYEmGwMU2dYlGTiICDC8agjWH/pH7OMcu1L7nLSTfMHXUbN+l92apNvFiPWx/XKKcEqwE0JCBCxOVcJjv9NftNWApo6DhXac3e/+ib+yIXl5ikag0hTe1+Tl/HwrUjXE8yJBkXzN86mKZkz0A5Gd0KQE5DqQ4gKEeVC//6dLOzH8FcuAIATkjRABilGlaYxtQfXsOYzhMYHACik4sujoEU3/8+9Tsi2LKxZFehVcYwnTPKBsXLhKPP//tyZPIIEnBRRZPbELBCKfipHCOuCaUrFs9sQsEXKGJkUIo4NcxJWx0jXX//9TGsS2i3//6IARUqW1ATrmbVGsqv11Whz7KWIMcQxI4gFr8rPibM8WfH6iyN1RvI1X78v5xGa6h5ZE14gfBQ1/lELSmgR016AAFQATAWA6MJchk1RyXDk0Ex4MAwOigqdy4ctt+///R8yohjm2alGbRHqzMvp+3/+ysRf1q1lt/52oqJ8sj1uSeXHEYqOYaDH/stzxIeAAMg6ABQhBZiVptey/t7t/vbcOznZTqn82nBspz5fk0p0LpEWdcvz6gyOL4WNmEEBbmz0mHCpcCoOf++I4QYUam/jKPNvYweB6TReHAP4xMuEL4sGnaCltNXubusat6QTNFVyKYiUgTIQkmgMMPyXfF9FLr/+pD/+3Bk64ASSQZFs17YAEKMGJEcIq5I3G0dTPRAwPinoqQgjri0BFDAbiAwRD0S//RRjgAyAaQkIFHiz021Zd6p+/ItEZutNo6CP5dVUIluN/ZdXPLwE9zt5F/p05X8y0J2q4RgZLqNHv/4LcmqAABJpRAQQGnmYQA8xpPERn8dGXFgoAoOux2IfsPTofc2SjjsmlylOHWikkPiry0HmXuivqfGhVSP+lVdRMwGRQkpbQVPf5BtZPW4FDIABi4THHst2svfXU/zHXOfZ2TiFGr/t5UUiJ6h9cvWbBP6Jwo8jYP1aiEl1b1KxqjXVh0JIoZECCwxFBsU3//pp7OduYIVIAGWgbm5g/j1GkSN+YQYGBgMADlvmCz0yBCX//t/9HStXrI5XXZb+2ql6rot+8yyV/6ObNeyL9/R//tyZO2JEndLxZPbELA/6aipCCPYCKgZGSz7QADopmKkUIp4tKLX9Fu9zqgpgaSdLGR//04pUTJRlUqK+qdko2zrZfu+7nvdwecIAo+Vv1nBc7InZThTbbKtgsuX6nF/p5F8+7HqeD3r9eM9aVMxAt/+9XMMeC0ATcIAjuYBQFRg2jcmgSPYetiZAMXHWIxN/5Zbbr9f81e61ote8GlHsVWzKyJ/t9JqpGafVy3N/1yoT/6PzV9m0D2JSVmWglwbd/92swSwKUjlkssjQSVPe5bHMSxbV9dBI7UL6y2XYi1KgC0sFHFx6ld3ePCP9NCu328j//s0jIABki5p4BhMEZmq4P8YTwHpgQgFA4AVa0JkkZpitvP/2099HZNWEzSoVUZtlpLXeizq23RWRzv+U3pTZkvl/+6q7kH/+3Bk8QgSVgZFyz7QAEdsSJYgIp4JrS8WTPhAwP2oYkggjyBXbcx1V3Z0U6uWPYziBP3egUE0QrKNSAMgXgO4FDWISI945f5p8b8ZKqx40aX8aK2Wh0vd8xam0Zzr0mT/3kuZ/W75NvVSXWPVJSHvld0YTOQeGr/9f602d8x6CB5lAYoFuNogBngJBEw0QQ5YSM8ki46RDE2cP4La1E/9+5PZtfK9DtUcamKjSoFedcawOsLLm4ozQKPUj+n7Clvfigz/++weBBZQAsMB2MYz+znvn/utH/d41uhBOdE1dwiMdjXzdjJd9tDEr6JZ63f1X+/vfZZzBmRFZRwUyuCGLQEb/sZMxiQmOA63qAAEBs2YpqEegpCdcsCiKlzq0d2sG6kaqLmt300JHPFTR0eSb1xUsJ5kYQMH//tyZOwMAnJPxbPaELAw4AkdACIAC1FFEk14QQEbsaJggJX5nr/d+vl10IahhgHQUC8f/2SHpcsjo4KKkRfT/p9cwreVLAE8OyHEwSs4Dy+If3ZC2ymd8o5XuQTN/7OUh4RImCZESmjiRZuhFSqAI3/3rKC4EQppAATvMBAoMXWdPg3KMWQtMCgEQfWIzt/5Zb31facz2VE1SaMtH1vW7f60zNZ0LfXs0rqVe//KtX/u0lV3m0NvNKYEFK6hx3jHP0F9w9LkgCAlItqAAYdSNvR+2mrrrz8lrNogYDY5HluJiN/kp7yzm23dmQdLf+fMvLyszaolO5KlMyYc3wcoIQT/Vr12HHk3erlACyppoYkIyd5HwcwiDhSuX6s3KuU1m7q127JNAo1ioqaW5vuayIj6b2s7u343KJL/+3Bk5oCSJxvHU7kQoELqKKYUIm4IVBcYzHdAAPwookhQjrjp3ahwOUBUj/9m2SWBDg/crKneVX7S7M0qcxla6kHF3NVQaHwJpC4+3tin+XEODFI173XZ2AwTasJMEgAU7/s6RVEZQAScMBQrMXGuPfnbOwuMWFQCKna4/kvsOvXd/9U/0SSeZrohPd75J2be6KYpWVH0b6H20Vmrpv5O67a0temWVlVVo+znaYrgUGf9iL1uiABsFgwDnIMwTLSJ5qU5kT5ZjTWzJuc/1czgRaOaNhs1kaAnVESOzy9u2tpAEv2zL0eeTm6qvZOvQy4tday2hGBu/J0ht50uJA4LAqQKR6CyxqqYmoseFnuc8gEDVrPzfu1gleIrV+uBAwfEKtyum76l8XYP0danKX+lCiY5IqSzCyow//tyZOwIEnlRRROgErBBahisCCOuB9QZGSx3QADXDCLkEI04CKAbP/SjNsYEIEYoAIZFXVD9NU1++8/M3zWpPrubJn/TkLWwSBUssIjmglI0TI2UI4zxTk9HM6Mc5mIIihTlA+PO+Mb//22kol1FsGpABWcCA0YfqidTrkfr4GAVOzhy43OZt/r6daa9ldGPOrnV9FkUl6Haj7aSqqKz+/smb9r+ivv+29afpqdlQ5tmsZLDBDlODf/LcXclDCMKJkACqkUrI1krRtLOuqVtfRr2c5cS51a13OyaNkUyIdTPS0nIXbN5aRr26W/6EVgjR2zQDA/tEVSuCFCwgMjH+zOvoclqkhx0YFyTO4xCPE6+NIxEAsMApgsDDAgtvXTz9aatfbrX30tvZi78k6zp6HqyaI790pf3W6v/+3Bk9IkSkE/Ek7oQsEpKGIUEI44H3BcXLHdAAQ+wIhQglrm3/X+9Etuu5NXMEJDwXKAuKv/r8/ixMA2ZX9QAeRTKbrlms7U/3ptoAhKW5mIxQiyLdB12ODY1wu1powg+PWLPvs21cCot1PeFEB9g0accb/16ENFGi6oBRCq5ABqgVBEwqQY4ASE5ki8aYjW3YjAslN9b01tsdrv68+oWpFPZSLP2umr9Ck/b6a3W2iFs662dfb8v9f+T0OhpzQskz/tvgVoWRACjTfIA8w9SJFCnNkFt0NymBI9ZkIhcflkoc8dpEQ6wb3exH/RyQqxUyIj4HZ/++aUAAi0EAxgEBJhyZxz2WZ9iBwLLoqOpm31dev110pQjMqoZiu3oRsljOz0bWquqJO26Vld7G/7bvv6aon6kfot9//tyZO+KAndRRRO5ELBIKfiWCCPYCTEtFwx0QID+kOLkEQ8A2eWsi0MhQcCv/+5WdWAjAgyAAjmZPGu0jlzNvqLrJdiCgGPHbIcNCFkPZyscJ481nUVmhnWrZx4XtbKRvSRSMeQq4ptasRBkcOgzFKq//+xvqr0R8EoA//IAFQKYPEJl9wnbYkAhwX4XO/cXldvv/vX/X7WrqRboyOuQ9HZVR3qcS6O04M+exl7IqVJ/K9PR9feqafbyel9Jlra5l5VPR3VmBO//enJdoGEOgASk9yLcCPdtle7s32vftObZiiGad1e2tP9mpRf6+qqvT90907dvdlu91zPIx1SyjqgcIRD9ttCVPL0iJQAQCZFLplbqLAIAAAAAUuThhA0CHOCT5VaXamuBBJVLdZ9JABi8DEmc0tIDRCz/+3Bk6gICZVBFy7kQoDGAGMkAIgAJqT0XDuRCQSKxImQQingM6OMkxwDQNwMQHAxhcGpI5kUGQJtIA0eDUCAcIAKHomKBRQOm5XNQJAgFBIX2ABBAUAoqO6Zu1NQkAtQoMQUGyLd1K2dBDJYc0gRRIaTBF1fsvW76ZaLZeLpkXjpQ1/urqZkLIG5oamyJdKRmdNP/9939svmxqbF4xOHEy4xsikAAQAAAAB1hPmzN9B1PUJsnzpkwn/oVQavr/yVJQlJFVb/88Q0tiiWdWO//IEixEGtKxtP/+aMKkwjcSzQtAs9rP//9GioVHB2DcTA6EAWskVa4WTBUQv///DI7uJJPzDw0vh9dN0V8KKpVTEFNRVJqWjVdTdKuvaHbkqonvEp0RTu/6g7yzxLDhFYaUJfbf/6no93///tyZOqAAotQxjVwQABAyaipoIgAFbF3I7m6AAGqLuETBoAA6f/eRWdUSUaISTSA0gCrhE9r9JZ4lnmTtGtxK///50t//kp7/pLPEtnrcWVMQU1FMy45OS4zVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+3Bkng/xXwA11wBgCCWgBM3gAAAAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();

// safe way to unlock
let unlocked = false;
const safeUnlock = () => {
  if ( !unlocked ) {
    unlock();
    unlocked = true;
  }
};

const onDecodeSuccess = decodedAudio => {
  if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
    wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
    safeUnlock();
  }
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  safeUnlock();
};
const decodePromise = phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
if ( decodePromise ) {
  decodePromise
    .then( decodedAudio => {
      if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
        wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
        safeUnlock();
      }
    } )
    .catch( e => {
      console.warn( 'promise rejection caught for audio decode, error = ' + e );
      safeUnlock();
    } );
}
export default wrappedAudioBuffer;