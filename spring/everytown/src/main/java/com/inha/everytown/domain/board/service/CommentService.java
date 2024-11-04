package com.inha.everytown.domain.board.service;

import com.inha.everytown.domain.board.dto.CommentReqDto;
import com.inha.everytown.domain.board.dto.CommentResDto;
import com.inha.everytown.domain.board.entity.relation.Board;
import com.inha.everytown.domain.board.entity.relation.Comment;
import com.inha.everytown.domain.board.repository.relation.BoardRepository;
import com.inha.everytown.domain.board.repository.relation.CommentRepository;
import com.inha.everytown.domain.member.entity.Member;
import com.inha.everytown.domain.member.repository.MemberRepository;
import com.inha.everytown.global.exception.CustomException;
import com.inha.everytown.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository;

    public Page<CommentResDto> getCommentPage(Long boardId, int page) {
        Pageable pageable = getPageable(page);
        Page<CommentResDto> commentPage = commentRepository.findByBoard_Id(boardId, pageable).map(CommentResDto::EntityToDto);
        return commentPage;
    }

    public CommentResDto saveComment(Long memberId, Long boardId, CommentReqDto reqDto) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new CustomException(ErrorCode.AUTH_MEMBER_NOT_FOUND));
        Board board = boardRepository.findById(boardId).orElseThrow(() -> new CustomException(ErrorCode.BOARD_NO_SUCH_BOARD));
        Comment comment = commentRepository.save(
                Comment.builder()
                        .member(member)
                        .board(board)
                        .content(reqDto.getContent())
                        .build()
        );
        board.increaseCommentCnt();
        return CommentResDto.EntityToDto(comment);
    }

    public CommentResDto updateComment(Long memberId, Long commentId, CommentReqDto reqDto) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NO_SUCH_COMMENT));
        if(!memberId.equals(comment.getMember().getId())) throw new CustomException(ErrorCode.UNAUTHORIZED_MEMBER);
        comment.update(reqDto);
        return CommentResDto.EntityToDto(comment);
    }

    public void deleteComment(Long memberId, Long boardId, Long commentId) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NO_SUCH_COMMENT));
        if(!memberId.equals(comment.getMember().getId())) throw new CustomException(ErrorCode.UNAUTHORIZED_MEMBER);
        commentRepository.delete(comment);

        Board board = boardRepository.findById(boardId).orElseThrow(() -> new CustomException(ErrorCode.BOARD_NO_SUCH_BOARD));
        board.decreaseCommentCnt();
    }

    public void deleteCommentRelatedBoard(Long boardId) {
        commentRepository.deleteByBoard_Id(boardId);
    }

    private Pageable getPageable(int page) {
        Sort sort = Sort.by(Sort.Order.asc("createdAt"));
        return PageRequest.of(page, 20, sort);
    }
}
