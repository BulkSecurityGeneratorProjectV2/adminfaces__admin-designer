$(function () {

    'use strict'

    /**
     * Get access to plugins
     */

    $('[data-toggle="control-sidebar"]').controlSidebar()
    $('[data-toggle="push-menu"]').pushMenu()

    var $pushMenu = $('[data-toggle="push-menu"]').data('lte.pushmenu')
    var $controlSidebar = $('[data-toggle="control-sidebar"]').data('lte.controlsidebar')


    function changeLayout(cls) {
        $('body').toggleClass(cls)
        if ($('body').hasClass('fixed') && cls == 'fixed') {
            $pushMenu.expandOnHover()
        }
        $controlSidebar.fix()
    }


    /**
     * Get a prestored setting
     *
     * @param String name Name of of the setting
     * @returns String The value of the setting | null
     */
    function get(name) {
        if (typeof (Storage) !== 'undefined') {
            return localStorage.getItem(name)
        } else {
            console.warn('LocalStorage not available for your browser. Layout customization will not work.')
        }
    }

    /**
     * Store a new settings in the browser
     *
     * @param String name Name of the setting
     * @param String val Value of the setting
     * @returns void
     */
    function store(name, val) {
        if (typeof (Storage) !== 'undefined') {
            localStorage.setItem(name, val)
        } else {
            console.warn('LocalStorage not available for your browser. Layout customization will not work.')
        }
    }

    function updateSidebarSkin(sidebarSkin) {
        var $sidebar = $('.control-sidebar');
        var sidebarSkinCkbox = $('#sidebar-skin span.ui-chkbox-icon');
        if (sidebarSkin == 'control-sidebar-light') {
            $sidebar.removeClass('control-sidebar-dark');
            sidebarSkinCkbox.addClass('ui-icon-blank');
            sidebarSkinCkbox.removeClass('ui-icon-check');
            sidebarSkinCkbox.parent().removeClass('ui-state-active');
        } else {
            $sidebar.removeClass('control-sidebar-light');
            sidebarSkinCkbox.addClass('ui-icon-check');
            sidebarSkinCkbox.removeClass('ui-icon-blank');
            sidebarSkinCkbox.parent().addClass('ui-state-active');
        }

        $sidebar.addClass(sidebarSkin);

        store('layout.sidebar-skin',sidebarSkin);
    }


    function updateSidebarToggle() {
        var sidebarControlOpen = get('layout.sidebar-control-open');

        var sidebarOpenCkbox = $('#sidebar-toggle span.ui-chkbox-icon');
        if (sidebarControlOpen) {
            sidebarOpenCkbox.addClass('ui-icon-check');
            sidebarOpenCkbox.removeClass('ui-icon-blank');
            sidebarOpenCkbox.parent().addClass('ui-state-active');
        } else {
            sidebarOpenCkbox.addClass('ui-icon-blank');
            sidebarOpenCkbox.removeClass('ui-icon-check');
            sidebarOpenCkbox.parent().removeClass('ui-state-active');
        }

        changeLayout('control-sidebar-open');

        sidebarControlOpen = $('body').hasClass('control-sidebar-open');

        if (sidebarControlOpen) {
            $('.control-sidebar').removeClass('control-sidebar-open')
        }
        store('layout.sidebar-control-open',sidebarControlOpen);


    }

    /**
     * Retrieve default settings and apply them to the template
     *
     * @returns void
     */
    function setup() {

        var sidebarSkin = get('layout.sidebar-skin');

        if (!sidebarSkin) {
            sidebarSkin = 'control-sidebar-dark';
        }
        updateSidebarSkin(sidebarSkin);

        updateSidebarToggle();

        // Add the layout manager
        $('[data-layout]').on('click', function () {
            changeLayout($(this).data('layout'))
        });

        $('#sidebar-skin').on('click', function () {
            var sidebarSkin;
            if ($('.control-sidebar').hasClass('control-sidebar-dark')) {
                sidebarSkin = 'control-sidebar-light'
            }
            else {
                sidebarSkin = 'control-sidebar-dark';
            }

            setTimeout(function () {
                updateSidebarSkin(sidebarSkin);
            },20);
        });

        $('[data-enable="expandOnHover"]').on('click', function () {
            $(this).attr('disabled', true)
            $pushMenu.expandOnHover()
            if (!$('body').hasClass('sidebar-collapse'))
                $('[data-layout="sidebar-collapse"]').click()
        });

        //  Reset options
        if ($('body').hasClass('fixed')) {
            $('[data-layout="fixed"]').attr('checked', 'checked')
        }
        if ($('body').hasClass('layout-boxed')) {
            $('[data-layout="layout-boxed"]').attr('checked', 'checked')
        }
        if ($('body').hasClass('sidebar-collapse')) {
            $('[data-layout="sidebar-collapse"]').attr('checked', 'checked')
        }

        $('#content').click(function () {
            $('.control-sidebar').removeClass('control-sidebar-open');
        })

        if ($('body').hasClass('layout-top-nav')) {
            $('#horizontal-layout').prop('checked', false);
        } else {
            $('#horizontal-layout').prop('checked', true);
        }

        $('#sidebar-toggle').on('click', function () {
            setTimeout(function () {
                updateSidebarToggle();
            },20);

        });

    }


    $(document).on("pfAjaxComplete", function () {
        setTimeout(function () {
            setup();
        }, 20);
    });

    $(document).ready(function () {
        setTimeout(function () {
            setup();
        }, 20);
    });


});

