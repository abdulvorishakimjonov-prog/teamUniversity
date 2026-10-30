@extends('front.layouts.site')
@php
@endphp
@section('content')
<div class="breadcrumbs">
<div class="container">
<div class="breadcrumbs-wrapper">
<h1 class="headline5 slate900">{{ $title }}</h1>
<div class="d-flex align-items-center gap-1">


</div>
@include('front.components.breadcrumbs')</div>
</div>
<div class="breadcrumbs-img">
<img alt="" src="/front/images/breadcrumb-bg.png"/>
</div>
</div>
<div class="layout">
<div class="container">
<div class="layout-content">
<div class="course">

@foreach($items->where('category_slug', 'overview-intro') as $overview)
{{-- Hero as in Figma: text and Apply button, programme photo on the right. --}}
<div class="international-content">
<div class="international-content-main">
<div class="international-content-main-title">
<h5 class="subtitle2 slate900">{{ sectionValue($overview, 'title') }}</h5>
<p class="body3 slate600">{{ sectionValue($overview, 'description') }} <br/> {{ sectionValue($overview, 'description_continued') }}</p>
<a class="button" href="{{ sectionLink($overview, 'button_link', routeGenerate('admissions', 'online-application')) }}"> {{ sectionValue($overview, 'button_label') }} <i class="i-link"></i>
</a>
</div>
@if($heroImage = contentImage($overview))
<div class="international-content-main-box"><img alt="" src="{{ $heroImage }}"/></div>
@endif
</div>
<div class="about-section-carousel owl-carousel owl-theme">
<div class="about-section-carousel-item">
<img alt="" src="/front/images/about-section-bg.svg"/>
</div>
</div>
</div>
@endforeach

<div class="course-content">

@foreach($items->where('category_slug', 'pre-foundation-course-content-title') as $heading)
<div class="course-content-title">
<h5 class="subtitle2 slate900">{{ sectionValue($heading, 'title') }}</h5>
<p class="body3 slate600">
<blockquote>{{ sectionValue($heading, 'description') }}</blockquote> {{ sectionValue($heading, 'additional_description') }} </p>
</div>
@endforeach


@foreach($items->where('category_slug', 'course-content-link') as $title)
<div class="course-content-link">
@if($ic = sectionIcon($title, "icon"))<i class="{{ $ic }}" aria-hidden="true"></i>@endif
<p class="body3 blue900">{{ sectionValue($title, 'title') }}</p>
</div>
@endforeach

<div class="about-section-carousel owl-carousel owl-theme">
<div class="about-section-carousel-item">
<img alt="" src="/front/images/about-section-bg.svg"/>
</div>
</div>
<div class="about-page-content-wrapper">

@foreach($items->where('category_slug', 'pre-foundation-duration-cards') as $about)
@foreach(sectionItems(collect([$about]), $about->category_slug) as $duration)
<a class="about-page-content-wrapper-card" href="{{ sectionLink($duration, 'link_1') }}">
<div class="about-page-content-wrapper-card-image">
@if($ic = sectionIcon($duration, "icon"))<i class="{{ $ic }}" aria-hidden="true"></i>@else<img alt="" src="{{ cardImage($duration, cardIconFile('about-page-content-wrapper-card-image', $loop->index ?? 0)) }}"/>@endif
</div>
<div class="about-page-content-wrapper-card-content">
<p class="body2 slate600">{{ sectionValue($duration, 'label') }}</p>
<h5 class="subtitle3 blue900">{{ sectionValue($duration, 'value') }}</h5>
</div>
</a>
@unless ($loop->last)
    <div class="about-page-content-wrapper-line"></div>
@endunless
@endforeach
@endforeach

</div>
</div>
<div class="foundation-info">

@foreach($items->where('category_slug', 'foundation-info-title') as $subtitle)
<div class="foundation-info-title">
<h5 class="subtitle2 slate900">{{ sectionValue($subtitle, 'title') }}</h5>
<p class="body8 slate600">{{ sectionValue($subtitle, 'description') }}</p>
</div>
@endforeach

<div class="foundation-info-wrapper">

@foreach($items->where('category_slug', 'pre-foundation-benefit-cards') as $image)
@foreach(sectionItems(collect([$image]), $image->category_slug) as $benefit)
<div class="foundation-info-wrapper-item">
<h5 class="subtitle4 slate700">{{ sectionValue($benefit, 'number') }}</h5>
<div class="foundation-info-wrapper-item-image">
@if($ic = sectionIcon($benefit, "icon"))<i class="{{ $ic }}" aria-hidden="true"></i>@else<img alt="" src="{{ cardImage($benefit, cardIconFile('foundation-info-wrapper-item-image', $loop->index ?? 0)) }}"/>@endif
</div>
<h5 class="subtitle6 slate800">{{ sectionValue($benefit, 'name') }}</h5>
<p class="body3 slate600">{{ sectionValue($benefit, 'description') }}</p>
</div>
@endforeach
@endforeach




</div>
</div>
<div class="course-wrapper grid _2">

@foreach($items->where('category_slug', 'pre-foundation-entry-requirements') as $course)
<a class="course-wrapper-card" href="{{ sectionLink($course, 'link_1') }}">
<h5 class="subtitle2 slate900">{{ sectionValue($course, 'title') }}</h5>
<div class="course-wrapper-card-item body3 slate900">
@foreach(sectionItems(collect([$course]), $course->category_slug) as $line)
<p><span></span>{{ sectionValue($line, 'text') }}</p>
@endforeach
</div>
</a>
@endforeach


@foreach($items->where('category_slug', 'pre-foundation-program-details') as $introduction)
<a class="course-wrapper-card" href="{{ sectionLink($introduction, 'link_1') }}">
<h5 class="subtitle2 slate900">{{ sectionValue($introduction, 'title') }}</h5>
<div class="course-wrapper-card-inner">

@foreach($items->where('category_slug', 'programme-value-cards') as $values)
@foreach(sectionItems(collect([$values]), $values->category_slug) as $value)
<div class="course-wrapper-card-inner-info">
<div class="course-wrapper-card-inner-info-icon">
@if($ic = sectionIcon($value, "icon"))<i class="{{ $ic }}" aria-hidden="true"></i>@else<img alt="" src="{{ cardImage($value, cardIconFile('course-wrapper-card-inner-info-icon', $loop->index ?? 0)) }}"/>@endif
</div>
<div class="course-wrapper-card-inner-info-text">
<p class="body8 slate600">{{ sectionValue($value, 'label') }}</p>
<h6 class="subtitle8 blue900">{{ sectionValue($value, 'value') }}</h6>
</div>
</div>
@endforeach
@endforeach




</div>
</a>
@endforeach

</div>

@foreach($items->where('category_slug', 'pre-foundation-application-banner') as $foundation)
<div class="foundation-main">
<div class="foundation-main-title">
<h5 class="subtitle2">{{ sectionValue($foundation, 'title') }} <span class="red700">{{ sectionValue($foundation, 'highlight') }}</span></h5>
<p class="body3 slate600 line-clamp-2">{{ sectionValue($foundation, 'description') }}</p>
</div>
<a class="button" href="{{ buttonHref($foundation, 'button_label') }}">
<p>{{ sectionValue($foundation, 'button_label') }}</p>
<i class="i-link"></i>
</a>
</div>
@endforeach


@foreach($items->where('category_slug', 'learning-outcomes') as $details)
<div class="course-main">
<h5 class="subtitle2 slate900">{{ sectionValue($details, 'title') }}</h5>
<div class="course-main-list">
@foreach(sectionItems(collect([$details]), $details->category_slug) as $outcome)
<div class="course-main-item">
<span class="subtitle7 red700">{{ sectionValue($outcome, 'number') }}</span>
<p class="body8 slate700">{{ sectionValue($outcome, 'description') }}</p>
</div>
@endforeach
</div>
</div>
@endforeach

<div class="course-bg">
<img alt="" src="{{ staticImages('team.media.couse-img-1.png', true) }}"/>
<div class="course-bg-title">

@foreach($items->where('category_slug', 'course-bg-title-text') as $bg)
<div class="course-bg-title-text">
<h5 class="subtitle2 slate900">{{ sectionValue($bg, 'title') }}</h5>
<p class="body3 slate700">{{ sectionValue($bg, 'description') }}</p>
</div>
@endforeach


@foreach($items->where('category_slug', 'course-bg-title-item') as $mission)
<div class="course-bg-title-item">
<div class="course-bg-title-item-icon">
@if($ic = sectionIcon($mission, "icon"))<i class="{{ $ic }}" aria-hidden="true"></i>@else<img alt="" src="{{ cardImage($mission, cardIconFile('course-bg-title-item-icon', $loop->index ?? 0)) }}"/>@endif
</div>
<p class="subtitle8 blue900">{{ sectionValue($mission, 'title') }}</p>
</div>
@endforeach

</div>
</div>
</div>
</div>
<div class="layout-sidebar">
@include('front.components.sidebar')
</div>
</div>
</div>
@endsection
