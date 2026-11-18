tailwind.config = {
      theme: {
        extend: {
          colors: {
            /* sand  → warm ivory/cream backgrounds            */
            sand:  { 50:'#FFFCF9', 100:'#FFF5EC', 200:'#FFE5D0', 300:'#FFCFAC' },
            /* sage  → vibrant coral-red (main CTA/accent)     */
            sage:  { 400:'#E8604C', 500:'#CC3A28', 600:'#AA2C1C' },
            /* umber → deep spice-burgundy (dark sections)     */
            umber: { 700:'#3A0C08', 800:'#280804', 900:'#180402' },
            /* brass → bright gold (decorative/highlight)      */
            brass: { 200:'#F8DC8C', 300:'#F2C040', 400:'#E89A18', 500:'#C47C10' },
            /* taupe → warm mid-brown (secondary text)         */
            taupe: { 400:'#B08878', 500:'#907058', 600:'#705040' },
            /* mint  → warm blush/peach (alternate sections)   */
            mint:  { 50:'#FFF4F2', 100:'#FFEAE0' }
          },
          fontFamily: {
            display: ['Montserrat', 'system-ui', 'sans-serif'],
            body:    ['Inter', 'system-ui', 'sans-serif'],
          }
        }
      }
    }